import axios from "axios";

export async function processFile(file) {
	try {
		// Redirect the user to the authorization URL
		window.location.href = "/api/auth/authorize";
		// The rest of this function won't execute immediately due to the redirect
		// You'll need to handle the file upload after the OAuth flow is complete
	} catch (error) {
		console.error("Error processing file:", error);
		throw new Error("Failed to process file");
	}
}
