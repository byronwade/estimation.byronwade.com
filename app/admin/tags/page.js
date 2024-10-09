"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Search, MoreHorizontal, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PageHeader from "@/components/page-header";

export default function DefaultTags() {
	const initialTags = [
		{ id: 1, name: "Unit A" },
		{ id: 2, name: "Unit B" },
		{ id: 3, name: "Rough Plumbing" },
		{ id: 4, name: "Over Head Plumbing" },
		{ id: 5, name: "Wall Rough-In Plumbing Pipe" },
		{ id: 6, name: "Below Floor Pipe" },
		{ id: 7, name: "Plumbing Pipe Insulation" },
		{ id: 8, name: "Plumbing Valves And Devices" },
		{ id: 9, name: "Plumbing Fixtures" },
		{ id: 10, name: "Plumbing Equipment" },
		{ id: 11, name: "Bathroom" },
		{ id: 12, name: "Kitchen" },
		{ id: 13, name: "Outdoor" },
		{ id: 14, name: "Commercial" },
		{ id: 15, name: "Residential" },
	];

	const [tags, setTags] = useState(initialTags);
	const [newTag, setNewTag] = useState("");
	const [editingTag, setEditingTag] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [selectedTags, setSelectedTags] = useState([]);

	const addTag = () => {
		if (newTag.trim() !== "") {
			setTags([...tags, { id: tags.length + 1, name: newTag.trim() }]);
			setNewTag("");
			setIsAddDialogOpen(false);
		}
	};

	const updateTag = () => {
		if (editingTag && editingTag.name.trim() !== "") {
			setTags(tags.map((tag) => (tag.id === editingTag.id ? editingTag : tag)));
			setEditingTag(null);
		}
	};

	const deleteTag = (id) => {
		setTags(tags.filter((tag) => tag.id !== id));
		setSelectedTags(selectedTags.filter((tagId) => tagId !== id));
	};

	const toggleSelectTag = (id) => {
		setSelectedTags((prevSelected) => (prevSelected.includes(id) ? prevSelected.filter((tagId) => tagId !== id) : [...prevSelected, id]));
	};

	const toggleSelectAll = () => {
		if (selectedTags.length === filteredTags.length) {
			setSelectedTags([]);
		} else {
			setSelectedTags(filteredTags.map((tag) => tag.id));
		}
	};

	const deleteSelectedTags = () => {
		setTags(tags.filter((tag) => !selectedTags.includes(tag.id)));
		setSelectedTags([]);
	};

	const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div className="flex flex-col h-screen bg-background">
			<div className="border-b">
				<div className="flex items-center h-16 px-4">
					<PageHeader
						title="Default Tags"
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						onAddNew={() => setIsAddDialogOpen(true)}
						addNewText="New Tag"
						onSelectAll={toggleSelectAll}
						isAllSelected={selectedTags.length === filteredTags.length && filteredTags.length > 0}
						onEdit={() => {}} // You might want to implement bulk edit functionality
						onDelete={deleteSelectedTags}
						selectedCount={selectedTags.length}
						showEdit={false} // Since edit is handled per row
						showDelete={true}
					/>
				</div>
			</div>
			<div className="flex-1 p-8 pt-6 space-y-4">
				<div className="border rounded-md">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[50px]"></TableHead>
								<TableHead>Tag Name</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredTags.map((tag) => (
								<TableRow key={tag.id}>
									<TableCell>
										<Checkbox checked={selectedTags.includes(tag.id)} onCheckedChange={() => toggleSelectTag(tag.id)} />
									</TableCell>
									<TableCell>{tag.name}</TableCell>
									<TableCell className="text-right">
										<Dialog>
											<DialogTrigger asChild>
												<Button variant="ghost" size="sm" className="w-8 h-8 p-0">
													<Edit className="w-4 h-4" />
													<span className="sr-only">Edit</span>
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Edit Tag</DialogTitle>
												</DialogHeader>
												<div className="grid gap-4 py-4">
													<div className="grid items-center grid-cols-4 gap-4">
														<Label htmlFor="editTagName" className="text-right">
															Tag Name
														</Label>
														<Input id="editTagName" value={editingTag?.name || ""} onChange={(e) => setEditingTag(editingTag ? { ...editingTag, name: e.target.value } : null)} className="col-span-3" />
													</div>
												</div>
												<DialogFooter>
													<Button onClick={updateTag}>Save Changes</Button>
												</DialogFooter>
											</DialogContent>
										</Dialog>
										<Button variant="ghost" size="sm" className="w-8 h-8 p-0" onClick={() => deleteTag(tag.id)}>
											<Trash2 className="w-4 h-4" />
											<span className="sr-only">Delete</span>
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
