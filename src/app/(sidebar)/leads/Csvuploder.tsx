"use client";
import { File, Upload, X } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import supabaseClient from "@/lib/supabase";
import { useSession } from "@clerk/nextjs";

export default function CsvUploader() {
	const { session } = useSession();
	const [csv, setCsv] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [uploadSuccess, setUploadSuccess] = useState(false);
	const supabase = supabaseClient(session);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const validateCsvFile = (file: File): boolean => {
		if (!file.type.includes("csv") && !file.name.toLowerCase().endsWith(".csv")) {
			setUploadError("Please select a valid CSV file");
			return false;
		}		
		return true;
	};

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		setUploadError(null);
		
		const files = Array.from(e.dataTransfer.files);
		const file = files[0];
		
		if (file && validateCsvFile(file)) {
			setCsv(file);
		}
	}, []);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUploadError(null);
		const file = e.target.files?.[0];
		
		if (file && validateCsvFile(file)) {
			setCsv(file);
		}
	};

	const removeFile = () => {
		setCsv(null);
		setUploadError(null);
		setUploadSuccess(false);
	};

	async function handleUpload() {
		if (!csv || !session) {
			setUploadError("Please select a file and ensure you're logged in");
			return;
		}

		setIsUploading(true);
		setUploadError(null);

		try {
			const csvText = await csv.text();
			const lines = csvText.split('\n').filter(line => line.trim());
			if (lines.length < 2) {
				throw new Error("CSV file must contain at least a header row and one data row");
			}

            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
			const expectedHeaders = ['name', 'email', 'source', 'note'];
			// Check if all required headers are present
			const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
			if (missingHeaders.length > 0) {
				throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
			}

			// Parse data rows
			const dataFromCsv = [];
			for (let i = 1; i < lines.length; i++) {
				const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, '')); // Remove quotes
				
				if (values.length !== headers.length) {
					console.warn(`Skipping row ${i + 1}: Column count mismatch`);
					continue;
				}

				const rowData: any = {};
				headers.forEach((header, index) => {
					rowData[header] = values[index] || null;
				});

				// Validate email format (basic validation)
				if (rowData.email && !rowData.email.includes('@')) {
					console.warn(`Skipping row ${i + 1}: Invalid email format`);
					continue;
				}
				dataFromCsv.push({...rowData,teacher: session.user.id});
			}

			if (dataFromCsv.length === 0) {
				throw new Error("No valid data rows found in CSV");
			}

			// Insert data into the database
			const { error } = await supabase
				.from("leads")
				.insert(dataFromCsv);

			if (error) {
				throw error;
			}

			setUploadSuccess(true);
			console.log(`Successfully uploaded ${dataFromCsv.length} leads`);
			
			// Clear the file after successful upload
			setTimeout(() => {
				setCsv(null);
				setUploadSuccess(false);
			}, 3000);

		} catch (error: any) {
			console.error("Upload error:", error);
			setUploadError(error.message || "Failed to upload CSV data");
		} finally {
			setIsUploading(false);
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="mx-5">
					Import CSV
					<File className="ml-2 h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Upload a CSV</DialogTitle>
					<DialogDescription>
						The CSV should contain the following columns: name, email, source, note
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Drag and Drop Area */}
					<div
						className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
							isDragging
								? "border-primary bg-primary/10"
								: "border-gray-300 hover:border-gray-400"
						}`}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
					>
						{csv ? (
							<div className="flex items-center justify-between p-2 bg-gray-50 rounded">
								<div className="flex items-center space-x-2">
									<File className="h-4 w-4 text-gray-500" />
									<span className="text-sm font-medium">{csv.name}</span>
									<span className="text-xs text-gray-500">
										({(csv.size / 1024).toFixed(1)} KB)
									</span>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={removeFile}
									className="h-6 w-6 p-0"
								>
									<X className="h-3 w-3" />
								</Button>
							</div>
						) : (
							<div className="space-y-2">
								<Upload className="mx-auto h-8 w-8 text-gray-400" />
								<div className="space-y-1">
									<p className="text-sm font-medium">
										Drag and drop your CSV file here
									</p>
									<p className="text-xs text-gray-500">or click to browse</p>
								</div>
								<input
									type="file"
									accept=".csv"
									onChange={handleFileSelect}
									className="hidden"
									id="csv-upload"
								/>
								<label htmlFor="csv-upload">
									<Button variant="outline" size="sm" asChild>
										<span className="cursor-pointer">Browse Files</span>
									</Button>
								</label>
							</div>
						)}
					</div>

					{/* Error Message */}
					{uploadError && (
						<div className="text-sm text-red-600 bg-red-50 p-2 rounded">
							{uploadError}
						</div>
					)}

					{/* Success Message */}
					{uploadSuccess && (
						<div className="text-sm text-green-600 bg-green-50 p-2 rounded">
							File uploaded successfully!
						</div>
					)}
				</div>

				<DialogFooter>
					<Button
						onClick={handleUpload}
						disabled={!csv || isUploading}
						className="w-full"
					>
						{isUploading ? "Uploading..." : "Upload"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}