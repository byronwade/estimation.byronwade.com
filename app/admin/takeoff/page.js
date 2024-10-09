"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { supabase, supabaseAdmin } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";

const processingSteps = ["Analyzing document structure", "Extracting text content", "Identifying key elements", "Processing CAD data", "Generating cost estimates", "Compiling final report"];

export default function FileProcessor() {
	const [file, setFile] = useState(null);
	const [processing, setProcessing] = useState(false);
	const [layersData, setLayersData] = useState(null);
	const [token, setToken] = useState(null);
	const searchParams = useSearchParams();

	useEffect(() => {
		const accessToken = searchParams.get("access_token");
		if (accessToken) {
			setToken(accessToken);
			// You might want to store this token securely, e.g., in HttpOnly cookies
		}
	}, [searchParams]);

	const onDrop = useCallback((acceptedFiles) => {
		setFile(acceptedFiles[0]);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"application/pdf": [".pdf"],
			"application/dxf": [".dxf"],
			"application/acad": [".dwg"],
		},
		multiple: false,
	});

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!file) return;

		setProcessing(true);
		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to upload file");
			}

			const result = await response.json();
			console.log("File processed successfully:", result);

			setLayersData({
				fileName: result.path,
				size: file.size,
				urn: result.urn,
				layers: result.layers,
			});
		} catch (error) {
			console.error("Error processing file:", error);
		} finally {
			setProcessing(false);
		}
	};

	if (!token) {
		return (
			<div className="container p-4 mx-auto space-y-8">
				<Card>
					<CardHeader>
						<CardTitle>Authorization Required</CardTitle>
					</CardHeader>
					<CardContent>
						<p>Please authorize the application to proceed.</p>
						<Button onClick={() => (window.location.href = "/api/auth/authorize")}>Authorize</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container p-4 mx-auto space-y-8">
			<Card>
				<CardHeader>
					<CardTitle>File Processor</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div {...getRootProps()} className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"}`}>
							<input {...getInputProps()} />
							<Upload className="w-12 h-12 mx-auto text-gray-400" />
							{isDragActive ? <p className="mt-2">Drop the file here ...</p> : <p className="mt-2">Drag & drop a file here, or click to select a file</p>}
							<p className="mt-1 text-xs text-gray-500">Supported files: PDF, DWG, DXF</p>
						</div>
						{file && <p className="text-sm text-gray-600">Selected file: {file.name}</p>}
						<Button type="submit" disabled={!file || processing}>
							{processing ? "Processing..." : "Process File"}
						</Button>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Processing Steps</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{processingSteps.map((step, index) => (
							<div key={index} className="flex items-center space-x-2">
								<div className="w-4 h-4 border border-gray-300 rounded-full" />
								<span className="text-gray-500">{step}</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{layersData && (
				<Card>
					<CardHeader>
						<CardTitle>Extracted Layers</CardTitle>
					</CardHeader>
					<CardContent>
						<p>File: {layersData.fileName}</p>
						<p>Size: {layersData.size} bytes</p>
						<p>URN: {layersData.urn}</p>
						<h3>Layers:</h3>
						<ul>
							{layersData.layers.map((layer, index) => (
								<li key={index}>{layer.name}</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}
		</div>
	);
}