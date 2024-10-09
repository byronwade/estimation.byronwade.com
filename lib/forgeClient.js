import ForgeSDK from "forge-apis";

const CLIENT_ID = process.env.FORGE_CLIENT_ID;
const CLIENT_SECRET = process.env.FORGE_CLIENT_SECRET;

const oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(CLIENT_ID, CLIENT_SECRET, ["data:read", "data:write"], true);

export async function getForgeToken() {
	const credentials = await oAuth2TwoLegged.authenticate();
	return credentials;
}

export async function translateFile(objectId, outputFormat = "svf") {
	const token = await getForgeToken();
	const derivativesApi = new ForgeSDK.DerivativesApi();

	const job = {
		input: { urn: Buffer.from(objectId).toString("base64") },
		output: { formats: [{ type: "svf", views: ["2d", "3d"] }] },
	};

	try {
		await derivativesApi.translate(job, {}, oAuth2TwoLegged, token);
		return job.input.urn;
	} catch (err) {
		console.error("Error translating file:", err);
		throw err;
	}
}

export async function getManifest(urn) {
	const token = await getForgeToken();
	const derivativesApi = new ForgeSDK.DerivativesApi();

	try {
		const manifest = await derivativesApi.getManifest(urn, {}, oAuth2TwoLegged, token);
		return manifest.body;
	} catch (err) {
		console.error("Error getting manifest:", err);
		throw err;
	}
}

export async function getMetadata(urn) {
	const token = await getForgeToken();
	const derivativesApi = new ForgeSDK.DerivativesApi();

	try {
		const metadata = await derivativesApi.getMetadata(urn, {}, oAuth2TwoLegged, token);
		return metadata.body;
	} catch (err) {
		console.error("Error getting metadata:", err);
		throw err;
	}
}
