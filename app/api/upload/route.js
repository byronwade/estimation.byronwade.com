import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { translateFile, getManifest, getMetadata } from "@/lib/forgeClient";

export async function POST(request) {
	const formData = await request.formData();
	const file = formData.get("file");

	if (!file) {
		return NextResponse.json({ error: "No file provided" }, { status: 400 });
	}

	try {
		// Upload to Supabase
		const fileExt = file.name.split(".").pop();
		const fileName = `${Math.random()}.${fileExt}`;
		const filePath = `uploads/${fileName}`;

		const { data, error } = await supabaseAdmin.storage.from("test").upload(filePath, file, {
			cacheControl: "3600",
			upsert: false,
		});

		if (error) throw error;

		// Get public URL of the uploaded file
		const { data: publicUrlData } = supabaseAdmin.storage.from("test").getPublicUrl(filePath);

		// Translate file using Forge API
		const urn = await translateFile(publicUrlData.publicUrl);

		// Wait for the translation to complete (you might want to implement a polling mechanism here)
		await new Promise((resolve) => setTimeout(resolve, 10000));

		// Get manifest and metadata
		const manifest = await getManifest(urn);
		const metadata = await getMetadata(urn);

		// Extract layers (this is a simplified example, you'll need to parse the metadata)
		const layers = metadata.data.metadata[0].layers || [];

		return NextResponse.json({
			success: true,
			path: data.path,
			urn: urn,
			layers: layers,
		});
	} catch (error) {
		console.error("Error processing file:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
