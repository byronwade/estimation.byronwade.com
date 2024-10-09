"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, X, ArrowUp, ArrowDown, Trash, Edit, Download, Settings, Upload, MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PageHeader from "@/components/page-header";

const initialLineItems = [
	{
		id: 1,
		description: '1/2" Dia Copper Material Pipe',
		quantity: 40,
		wastage: 0.1,
		unit: "LF",
		unitLaborCost: 4,
		unitMaterialCost: 3.1,
		tags: [{ name: "Copper", quantity: 40 }, { name: "Plumbing" }, { name: "Residential" }, { name: "Kitchen" }],
	},
	{
		id: 2,
		description: '3/4" Dia Copper Material Pipe',
		quantity: 370,
		wastage: 0.1,
		unit: "LF",
		unitLaborCost: 4,
		unitMaterialCost: 5,
		tags: [{ name: "Copper", quantity: 370 }, { name: "Plumbing" }, { name: "Commercial" }],
	},
	{
		id: 3,
		description: '1" PVC Pipe',
		quantity: 200,
		wastage: 0.05,
		unit: "LF",
		unitLaborCost: 3,
		unitMaterialCost: 2,
		tags: [{ name: "PVC", quantity: 200 }, { name: "Plumbing" }, { name: "Outdoor" }],
	},
];

const columnConfig = [
	{ key: "description", label: "Line Item", visible: true },
	{ key: "quantity", label: "Qty.", visible: true },
	{ key: "wastage", label: "Wastage", visible: true },
	{ key: "unit", label: "Unit", visible: true },
	{ key: "unitLaborCost", label: "Unit Labor Cost", visible: true },
	{ key: "unitMaterialCost", label: "Unit Material Cost", visible: true },
];

const InlineEdit = ({ value, onSave, type, format }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(value);

	useEffect(() => {
		setEditValue(value);
	}, [value]);

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			onSave(editValue);
			setIsEditing(false);
		} else if (e.key === "Escape") {
			setEditValue(value);
			setIsEditing(false);
		}
	};

	const handleBlur = () => {
		onSave(editValue);
		setIsEditing(false);
	};

	if (isEditing) {
		return <Input type={type} value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={handleKeyDown} onBlur={handleBlur} autoFocus />;
	}

	return (
		<div onClick={() => setIsEditing(true)} className="p-1 cursor-pointer">
			{format ? format(value) : value}
		</div>
	);
};

export default function LineItemsPage() {
	const [lineItems, setLineItems] = useState(initialLineItems);
	const [sortColumn, setSortColumn] = useState("description");
	const [sortDirection, setSortDirection] = useState("asc");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedItems, setSelectedItems] = useState([]);
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [uploadContent, setUploadContent] = useState("");
	const [isManageColumnsOpen, setIsManageColumnsOpen] = useState(false);
	const [isAllSelected, setIsAllSelected] = useState(false);
	const [isManageTagsOpen, setIsManageTagsOpen] = useState(false);

	const handleSort = (column) => {
		if (column === sortColumn) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortColumn(column);
			setSortDirection("asc");
		}
	};

	const handleContentChange = useCallback((itemId, key, value) => {
		setLineItems((prevItems) =>
			prevItems.map((item) => {
				if (item.id === itemId) {
					let newValue = value;
					if (key === "wastage") {
						newValue = parseFloat(value) / 100;
					} else if (["quantity", "unitLaborCost", "unitMaterialCost"].includes(key)) {
						newValue = parseFloat(value);
					}
					return { ...item, [key]: newValue };
				}
				return item;
			})
		);
	}, []);

	const addLineItem = () => {
		const newItem = {
			id: lineItems.length + 1,
			description: "New Line Item",
			quantity: 0,
			wastage: 0,
			unit: "EA",
			unitLaborCost: 0,
			unitMaterialCost: 0,
			tags: [],
		};
		setLineItems((prevItems) => [...prevItems, newItem]);
	};

	const handleUpload = () => {
		console.log("Uploading items:", uploadContent);
		setIsUploadModalOpen(false);
		setUploadContent("");
	};

	const sortedItems = [...lineItems].sort((a, b) => {
		if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
		if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
		return 0;
	});

	const filteredItems = sortedItems.filter((item) => item.description.toLowerCase().includes(searchTerm.toLowerCase()));

	const handleSelectAll = useCallback(() => {
		if (isAllSelected) {
			setSelectedItems([]);
		} else {
			setSelectedItems(lineItems.map((item) => item.id));
		}
		setIsAllSelected(!isAllSelected);
	}, [isAllSelected, lineItems]);

	const handleSelectItem = (itemId) => {
		setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
	};

	const handleDeleteSelected = () => {
		setLineItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
		setSelectedItems([]);
	};

	const handleExportSelected = () => {
		console.log("Exporting selected items:", selectedItems);
	};

	const handleEditSelected = () => {
		console.log("Editing selected items:", selectedItems);
	};

	const toggleColumnVisibility = (key) => {
		setColumnConfig((prev) => prev.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col)));
	};

	const SortableHeader = ({ column, children }) => (
		<TableHead className="text-left">
			<button onClick={() => handleSort(column)} className="flex items-center justify-between w-full font-medium text-left text-muted-foreground hover:text-foreground">
				{children}
				<span className="ml-2">
					{sortColumn === column && sortDirection === "asc" && <ArrowUp className="w-4 h-4" />}
					{sortColumn === column && sortDirection === "desc" && <ArrowDown className="w-4 h-4" />}
					{sortColumn !== column && (
						<span className="text-transparent select-none">
							<ArrowUp className="w-4 h-4" />
						</span>
					)}
				</span>
			</button>
		</TableHead>
	);

	useEffect(() => {
		setIsAllSelected(selectedItems.length === lineItems.length && lineItems.length > 0);
	}, [selectedItems, lineItems]);

	return (
		<div className="p-4 mx-auto space-y-4">
			<PageHeader
				title="Default Line Items"
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				onAddNew={addLineItem}
				addNewText="Add Line Item"
				onSelectAll={handleSelectAll}
				isAllSelected={isAllSelected}
				onEdit={handleEditSelected}
				onDelete={handleDeleteSelected}
				selectedCount={selectedItems.length}
				onUpload={() => setIsUploadModalOpen(true)}
				onManageTags={() => setIsManageTagsOpen(true)}
				onManageColumns={() => setIsManageColumnsOpen(true)}
				onExport={handleExportSelected}
				// Optionally hide certain elements
				showSelectAll={false}
				// showSearch={false}
				// showAddNew={false}
				// showEdit={false}
				// showDelete={false}
				// showMoreOptions={false}
			/>
			<div className="overflow-x-auto border rounded-md">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted">
							<TableHead className="w-[50px]">
								<Checkbox checked={selectedItems.length === filteredItems.length && filteredItems.length > 0} onCheckedChange={handleSelectAll} aria-label="Select all" />
							</TableHead>
							{columnConfig
								.filter((col) => col.visible)
								.map((col) => (
									<SortableHeader key={col.key} column={col.key}>
										{col.label}
									</SortableHeader>
								))}
							<TableHead className="text-left">Tags</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredItems.map((item) => (
							<TableRow key={item.id} className="hover:bg-muted/50">
								<TableCell className="w-[50px]">
									<Checkbox checked={selectedItems.includes(item.id)} onCheckedChange={() => handleSelectItem(item.id)} aria-label={`Select ${item.description}`} />
								</TableCell>
								{columnConfig
									.filter((col) => col.visible)
									.map((col) => (
										<TableCell key={col.key} className="text-left">
											<InlineEdit
												value={col.key === "wastage" ? (item[col.key] * 100).toFixed(0) : col.key === "quantity" ? item[col.key].toString() : col.key.toLowerCase().includes("cost") ? item[col.key].toFixed(2) : item[col.key].toString()}
												onSave={(value) => handleContentChange(item.id, col.key, value)}
												type={col.key === "description" || col.key === "unit" ? "text" : "number"}
												format={(value) => (col.key === "wastage" ? `${value}%` : col.key.toLowerCase().includes("cost") ? `$${parseFloat(value).toFixed(2)}` : value)}
											/>
										</TableCell>
									))}
								<TableCell>
									<div className="flex flex-wrap items-center gap-1">
										{item.tags.map((tag, index) => (
											<Badge key={`${item.id}-${index}`} variant="secondary" className="text-xs">
												{tag.name} {tag.quantity !== undefined && `(${tag.quantity})`}
											</Badge>
										))}
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			{isUploadModalOpen && (
				<Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Upload Items</DialogTitle>
						</DialogHeader>
						<Textarea value={uploadContent} onChange={(e) => setUploadContent(e.target.value)} placeholder="Paste your CSV or comma-delimited content here..." className="mb-4" rows={10} />
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
								Cancel
							</Button>
							<Button onClick={handleUpload}>Upload</Button>
						</div>
					</DialogContent>
				</Dialog>
			)}
			<Dialog open={isManageColumnsOpen} onOpenChange={setIsManageColumnsOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Manage Columns</DialogTitle>
					</DialogHeader>
					<ScrollArea className="h-[300px]">
						<div className="space-y-2">
							{columnConfig.map((col) => (
								<div key={col.key} className="flex items-center space-x-2">
									<Checkbox id={`column-${col.key}`} checked={col.visible} onCheckedChange={() => toggleColumnVisibility(col.key)} />
									<Label htmlFor={`column-${col.key}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
										{col.label}
									</Label>
								</div>
							))}
						</div>
					</ScrollArea>
				</DialogContent>
			</Dialog>
		</div>
	);
}
