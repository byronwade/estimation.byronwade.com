"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, ChevronDown, ChevronUp } from "lucide-react";
import { useSearchParams } from "next/navigation";

function CollapsibleJSON({ title, data }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="mb-4">
			<Button
				onClick={() => setIsOpen(!isOpen)}
				variant="outline"
				className="justify-between w-full"
			>
				{title}
				{isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
			</Button>
			{isOpen && (
				<pre className="p-4 mt-2 overflow-x-auto bg-gray-100 rounded">
					{JSON.stringify(data, null, 2)}
				</pre>
			)}
		</div>
	);
}

export default function FileProcessor() {
	const [file, setFile] = useState(null);
	const [processing, setProcessing] = useState(false);
	const [forgeData, setForgeData] = useState(null);
	const [token, setToken] = useState(null);
	const [error, setError] = useState(null);
	const [propertyData, setPropertyData] = useState(null);
	const searchParams = useSearchParams();

	useEffect(() => {
		const accessToken = searchParams.get("access_token");
		if (accessToken) {
			console.log('Setting access token:', accessToken);
			setToken(accessToken);
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
		setError(null);

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("File upload failed");
			}

			const data = await response.json();
			console.log('Forge API response:', data);
			setForgeData(data.forgeData);
			
			if (data.forgeData && data.forgeData.propertyDatabases) {
				setPropertyData(data.forgeData.propertyDatabases);
				const takeoffData = processPropertyData(data.forgeData.propertyDatabases);
				console.log('Takeoff Data:', takeoffData);
				// You can set this to a new state variable if you want to display it
				// setTakeoffData(takeoffData);
			}
		} catch (error) {
			console.error("Error processing file:", error);
			setError(error.message || "An error occurred while processing the file");
		} finally {
			setProcessing(false);
		}
	};

	function processPropertyData(propertyData) {
		const takeoffData = {
			pipes: [],
			fittings: []
		};

		propertyData.forEach(database => {
			if (database.data && database.data.collection) {
				database.data.collection.forEach(item => {
					if (item.name === 'Pipe') {
						takeoffData.pipes.push({
							id: item.objectid,
							diameter: item.properties.find(prop => prop.name === 'Diameter')?.value,
							length: item.properties.find(prop => prop.name === 'Length')?.value,
							material: item.properties.find(prop => prop.name === 'Material')?.value
						});
					} else if (item.name === 'Fitting') {
						takeoffData.fittings.push({
							id: item.objectid,
							type: item.properties.find(prop => prop.name === 'Type')?.value,
							size: item.properties.find(prop => prop.name === 'Size')?.value
						});
					}
				});
			}
		});

		return takeoffData;
	}

	return (
		<div className="container p-4 mx-auto space-y-8">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div {...getRootProps()} className="p-6 text-center border-2 border-gray-300 border-dashed rounded-lg">
					<input {...getInputProps()} />
					{isDragActive ? (
						<p>Drop the file here ...</p>
					) : (
						<p>Drag &apos;n&apos; drop a file here, or click to select a file</p>
					)}
				</div>
				<Button type="submit" disabled={!file || processing}>
					{processing ? "Processing..." : "Process File"}
				</Button>
			</form>

			{forgeData && (
				<Card>
					<CardHeader>
						<CardTitle>Forge Data</CardTitle>
					</CardHeader>
					<CardContent>
						<CollapsibleJSON title="Metadata" data={forgeData.metadata} />
						<CollapsibleJSON title="Manifest" data={forgeData.manifest} />

						<h3 className="mb-2 font-bold">Viewables</h3>
						{forgeData.viewables.map((viewable, index) => (
							<div key={index} className="mb-4">
								<h4 className="font-semibold">{viewable.name} ({viewable.role})</h4>
								<p>GUID: {viewable.guid}</p>
								<p>Status: {viewable.status}</p>
								<CollapsibleJSON title="Viewable Details" data={viewable} />
								{viewable.children && (
									<CollapsibleJSON title="Children" data={viewable.children} />
								)}
								{viewable.properties ? (
									<CollapsibleJSON title="Properties" data={viewable.properties} />
								) : (
									<p className="mt-2">No property data available</p>
								)}
							</div>
						))}

						<CollapsibleJSON title="Thumbnails" data={forgeData.thumbnails} />
					</CardContent>
				</Card>
			)}

			{propertyData && (
				<Card>
					<CardHeader>
						<CardTitle>Property Database</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{propertyData.map((database, index) => (
								<CollapsibleJSON
									key={index}
									title={`Database ${index + 1}`}
									data={database}
								/>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{error && (
				<Card>
					<CardHeader>
						<CardTitle>Error</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-red-500">{error}</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}