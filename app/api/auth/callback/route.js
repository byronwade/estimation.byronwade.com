import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");

	if (!code) {
		return NextResponse.json({ error: "No code provided" }, { status: 400 });
	}

	try {
		const tokenResponse = await exchangeCodeForToken(code);
		const { access_token } = tokenResponse.data;

		// Redirect back to the main page with the access token
		return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/takeoff?access_token=${access_token}`);
	} catch (error) {
		console.error("Error exchanging code for token:", error);
		return NextResponse.json({ error: "Failed to exchange code for token" }, { status: 500 });
	}
}

async function exchangeCodeForToken(code) {
	const clientId = process.env.FORGE_CLIENT_ID;
	const clientSecret = process.env.FORGE_CLIENT_SECRET;
	const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`;

	const data = new URLSearchParams({
		grant_type: "authorization_code",
		code: code,
		redirect_uri: redirectUri,
	});

	return axios.post("https://developer.api.autodesk.com/authentication/v2/token", data, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
		},
	});
}
