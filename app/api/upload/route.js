import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { extractDWGMetadata } from "@/lib/forgeClient";

const BUCKET_NAME = "dwg-files";

async function ensureBucketExists() {
	const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
	
	if (error) {
		console.error("Error listing buckets:", error);
		throw error;
	}

	const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);

	if (!bucketExists) {
		const { data, error: createError } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
			public: false,
			fileSizeLimit: 52428800 // 50MB
		});

		if (createError) {
			console.error("Error creating bucket:", createError);
			throw createError;
		}

		console.log("Bucket created:", BUCKET_NAME);
	} else {
		console.log("Bucket already exists:", BUCKET_NAME);
	}
}

export async function POST(request) {
	try {
		await ensureBucketExists();

		const formData = await request.formData();
		const file = formData.get("file");

		if (!file) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		const buffer = Buffer.from(await file.arrayBuffer());
		const fileBuffer = {
			name: file.name,
			buffer: buffer
		};

		// Upload to Supabase
		const { data, error } = await supabaseAdmin.storage
			.from(BUCKET_NAME)
			.upload(`${Date.now()}_${file.name}`, buffer);

		if (error) {
			console.error("Supabase upload error:", error);
			throw error;
		}

		// Extract metadata using Forge
		const forgeData = await extractDWGMetadata(fileBuffer);

		if (forgeData.error) {
			console.error("Error extracting metadata:", forgeData.error);
		}

		console.log('Forge data:', forgeData);

		return NextResponse.json({
			success: true,
			supabasePath: data.path,
			forgeData: forgeData,
			urn: forgeData.urn // Make sure this is the base64 encoded URN
		});

	} catch (error) {
		console.error("Error processing file:", error);
		return NextResponse.json({ 
			error: error.message, 
			details: error.stack
		}, { status: 500 });
	}
}