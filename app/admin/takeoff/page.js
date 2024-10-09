"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

const processingSteps = ["Analyzing document structure", "Extracting text content", "Identifying key elements", "Processing CAD data", "Generating cost estimates", "Compiling final report"];

export default function FileProcessor() {
	const [file, setFile] = useState(null);

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

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!file) return;
		// For now, we'll just log the file information
		console.log("File selected:", file.name);
		// You can add more logic here later when ready to process the file
	};

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
						<Button type="submit" disabled={!file}>
							Process File
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
		</div>
	);
}
