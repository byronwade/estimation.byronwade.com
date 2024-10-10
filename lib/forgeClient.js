const axios = require('axios');
const ForgeSDK = require('forge-apis');

const APS_CLIENT_ID = process.env.FORGE_CLIENT_ID;
const APS_CLIENT_SECRET = process.env.FORGE_CLIENT_SECRET;
const SCOPES = ['data:read', 'data:write', 'data:create', 'bucket:create', 'bucket:read'];

const oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(APS_CLIENT_ID, APS_CLIENT_SECRET, SCOPES, true);

async function getAccessToken() {
	await oAuth2TwoLegged.authenticate();
	return oAuth2TwoLegged.getCredentials().access_token;
}

async function createBucket(token) {
	const bucketKey = `takoff_${Date.now()}`;
	try {
		const response = await axios.post('https://developer.api.autodesk.com/oss/v2/buckets', {
			bucketKey,
			policyKey: 'transient'
		}, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});
		console.log('Bucket created:', response.data.bucketKey);
		return response.data.bucketKey;
	} catch (error) {
		if (error.response && error.response.status === 409) {
			console.log('Bucket already exists, using existing bucket');
			return bucketKey;
		}
		throw error;
	}
}

async function uploadFile(token, bucketKey, file) {
	const fileName = file.name;
	try {
		const response = await axios.put(`https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/objects/${fileName}`, file.buffer, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/octet-stream'
			}
		});
		console.log('File uploaded, objectId:', response.data.objectId);
		return response.data.objectId;
	} catch (error) {
		console.error('Error uploading file:', error);
		throw error;
	}
}

async function translateFile(token, objectId) {
	const urn = Buffer.from(objectId).toString('base64');
	const job = {
		input: { urn: urn },
		output: { formats: [{ type: 'svf', views: ['2d', '3d'] }] }
	};

	const response = await axios.post('https://developer.api.autodesk.com/modelderivative/v2/designdata/job', job, {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		}
	});

	console.log('Translation job started:', response.data);

	let status = 'inprogress';
	while (status === 'inprogress' || status === 'pending') {
		await new Promise(resolve => setTimeout(resolve, 5000));
		const manifestResponse = await axios.get(`https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/manifest`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		status = manifestResponse.data.status;
		console.log('Translation status:', status);
	}

	if (status === 'success') {
		console.log('Translation completed successfully');
		return { urn: urn };
	} else {
		throw new Error(`Translation failed with status: ${status}`);
	}
}

async function getMetadata(token, urn) {
	const response = await axios.get(`https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/metadata`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	return response.data;
}

async function getManifest(token, urn) {
	const response = await axios.get(`https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/manifest`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	return response.data;
}

async function getProperties(token, urn, guid) {
	try {
		const response = await axios.get(`https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/metadata/${guid}/properties`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response.data;
	} catch (error) {
		console.warn(`Failed to get properties for guid ${guid}: ${error.message}`);
		return null;
	}
}

async function getTree(token, urn, guid) {
	try {
		const response = await axios.get(`https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/metadata/${guid}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response.data;
	} catch (error) {
		console.warn(`Failed to get tree for guid ${guid}: ${error.message}`);
		return null;
	}
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getPropertyDatabase(token, urn, guid) {
	try {
		const response = await axios.get(`https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/metadata/${guid}/properties`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response.data;
	} catch (error) {
		if (error.response && error.response.status === 404) {
			console.log(`Property database not found for guid: ${guid}. This is normal for some file types or if translation is not complete.`);
			return null;
		}
		console.error('Error getting property database:', error);
		return null;
	}
}

async function extractDWGMetadata(file) {
	try {
		console.log('Starting extractDWGMetadata process');
		const token = await getAccessToken();
		console.log('Access token obtained');

		const bucketKey = await createBucket(token);
		console.log('Bucket created or existing:', bucketKey);

		const objectId = await uploadFile(token, bucketKey, file);
		console.log('File uploaded, objectId:', objectId);

		const translation = await translateFile(token, objectId);
		console.log('File translation completed:', translation);

		const urn = translation.urn;
		console.log('URN:', urn);

		const metadata = await getMetadata(token, urn);
		console.log('Metadata received:', JSON.stringify(metadata, null, 2));

		// Add a delay here to allow time for the translation to complete
		await delay(10000); // 10 seconds delay

		const manifest = await getManifest(token, urn);
		console.log('Manifest:', JSON.stringify(manifest, null, 2));

		let viewables = [];
		if (manifest.derivatives && manifest.derivatives[0] && manifest.derivatives[0].children) {
			viewables = manifest.derivatives[0].children.filter(child => child.type === 'geometry');
		}
		console.log('Viewables:', JSON.stringify(viewables, null, 2));

		const viewablesWithProperties = await Promise.all(viewables.map(async viewable => {
			const properties = await getPropertyDatabase(token, urn, viewable.guid);
			return {
				...viewable,
				properties
			};
		}));

		const thumbnails = manifest.derivatives[0].children
			.filter(child => child.type === 'resource' && child.role === 'thumbnail')
			.map(thumbnail => thumbnail.urn);

		return {
			objectId,
			urn,
			metadata,
			manifest,
			viewables: viewablesWithProperties,
			thumbnails
		};
	} catch (error) {
		console.error('Error in extractDWGMetadata:', error);
		return {
			objectId: null,
			urn: null,
			error: error.message,
			metadata: null,
			manifest: null,
			viewables: [],
			thumbnails: []
		};
	}
}

module.exports = {
	extractDWGMetadata
};