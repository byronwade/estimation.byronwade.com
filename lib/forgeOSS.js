import ForgeSDK from 'forge-apis';
import axios from 'axios';

const { AuthClientTwoLegged, BucketsApi, ObjectsApi } = ForgeSDK;

const FORGE_CLIENT_ID = process.env.FORGE_CLIENT_ID;
const FORGE_CLIENT_SECRET = process.env.FORGE_CLIENT_SECRET;
const FORGE_BUCKET_KEY = process.env.FORGE_BUCKET_KEY;

const oAuth2TwoLegged = new AuthClientTwoLegged(
  FORGE_CLIENT_ID,
  FORGE_CLIENT_SECRET,
  ['bucket:create', 'bucket:read', 'data:write', 'data:read'],
  true
);

async function getToken() {
  await oAuth2TwoLegged.authenticate();
  const credentials = oAuth2TwoLegged.getCredentials();
  console.log('Access Token:', credentials.access_token);
  return credentials;
}

export async function createBucket() {
  const token = await getToken();
  const bucketsApi = new BucketsApi();
  
  try {
    await bucketsApi.createBucket(
      { bucketKey: FORGE_BUCKET_KEY, policyKey: 'transient' },
      { autoRefresh: false },
      oAuth2TwoLegged,
      token
    );
    console.log(`Bucket ${FORGE_BUCKET_KEY} created.`);
  } catch (err) {
    if (err.statusCode === 409) {
      console.log(`Bucket ${FORGE_BUCKET_KEY} already exists.`);
    } else {
      console.error('Error creating bucket:', err);
      throw err;
    }
  }
}

export async function uploadFile(objectName, fileBuffer) {
  const token = await getToken();
  const objectsApi = new ObjectsApi();

  try {
    const response = await objectsApi.uploadObject(
      FORGE_BUCKET_KEY,
      objectName,
      fileBuffer.length,
      fileBuffer,
      {
        onUploadProgress: (progress) => {
          console.log(`Upload progress: ${progress.loaded}/${progress.total}`);
        }
      },
      {
        autoRefresh: false,
        headers: {
          'Authorization': 'Bearer ' + token.access_token
        }
      },
      oAuth2TwoLegged,
      token
    );

    console.log('Upload response:', response);
    return response.body;
  } catch (err) {
    console.error('Error uploading file:', err.response ? err.response.data : err.message);
    throw err;
  }
}
