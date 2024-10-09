// actions/getOAuthToken.js

import axios from "axios";

export async function getOAuthToken() {
	const client_id = process.env.CLIENT_ID;
	const client_secret = process.env.CLIENT_SECRET;

	const url = "https://developer.api.autodesk.com/authentication/v1/authenticate";

	const data = new URLSearchParams({
		client_id,
		client_secret,
		grant_type: "client_credentials",
		scope: "data:read data:write bucket:create",
	});

	try {
		const response = await axios.post(url, data, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		return response.data.access_token;
	} catch (error) {
		console.error("Error fetching token:", error.response.data);
		throw new Error("Failed to fetch token");
	}
}
