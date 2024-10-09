import axios from "axios";

export async function POST(req) {
	const url = "https://developer.api.autodesk.com/authentication/v2/token";
	const clientId = process.env.FORGE_CLIENT_ID;
	const clientSecret = process.env.FORGE_CLIENT_SECRET;

	if (!clientId || !clientSecret) {
		console.error("Forge credentials are missing");
		return new Response(JSON.stringify({ error: "Forge credentials are missing" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const response = await axios.post(
			url,
			new URLSearchParams({
				client_id: clientId,
				client_secret: clientSecret,
				grant_type: "client_credentials",
				scope: "data:read data:write data:create bucket:read bucket:create",
			}),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);

		return new Response(JSON.stringify(response.data), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error fetching token:", error.response ? error.response.data : error.message);
		return new Response(JSON.stringify({ error: "Failed to fetch token", details: error.response ? error.response.data : error.message }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
