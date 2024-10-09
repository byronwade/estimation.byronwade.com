import { NextResponse } from "next/server";

export async function GET(request) {
	const clientId = process.env.FORGE_CLIENT_ID;
	const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`;
	const scope = "data:read data:write data:create";

	const authUrl = new URL("https://developer.api.autodesk.com/authentication/v2/authorize");
	authUrl.searchParams.append("response_type", "code");
	authUrl.searchParams.append("client_id", clientId);
	authUrl.searchParams.append("redirect_uri", redirectUri);
	authUrl.searchParams.append("scope", scope);

	console.log("Authorization URL:", authUrl.toString());

	return NextResponse.redirect(authUrl.toString());
}
