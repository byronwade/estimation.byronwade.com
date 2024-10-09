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

export default function DefaultUnits() {
	const initialUnits = [
		{ id: 1, name: "LF", description: "Linear Feet" },
		{ id: 2, name: "EA", description: "Each" },
		{ id: 3, name: "FT", description: "Feet" },
		{ id: 4, name: "IN", description: "Inches" },
		{ id: 5, name: "SF", description: "Square Feet" },
		{ id: 6, name: "SY", description: "Square Yards" },
		{ id: 7, name: "CF", description: "Cubic Feet" },
		{ id: 8, name: "CY", description: "Cubic Yards" },
		{ id: 9, name: "GAL", description: "Gallons" },
		{ id: 10, name: "LBS", description: "Pounds" },
		{ id: 11, name: "TON", description: "Tons" },
		{ id: 12, name: "SET", description: "Set" },
		{ id: 13, name: "BOX", description: "Box" },
		{ id: 14, name: "ROLL", description: "Roll" },
		{ id: 15, name: "HR", description: "Hours" },
	];

	const [units, setUnits] = useState(initialUnits);
	const [newUnit, setNewUnit] = useState({ name: "", description: "" });
	const [editingUnit, setEditingUnit] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [selectedUnits, setSelectedUnits] = useState([]);

	const addUnit = () => {
		if (newUnit.name.trim() !== "" && newUnit.description.trim() !== "") {
			setUnits([...units, { id: units.length + 1, ...newUnit }]);
			setNewUnit({ name: "", description: "" });
			setIsAddDialogOpen(false);
		}
	};

	const updateUnit = () => {
		if (editingUnit && editingUnit.name.trim() !== "" && editingUnit.description.trim() !== "") {
			setUnits(units.map((unit) => (unit.id === editingUnit.id ? editingUnit : unit)));
			setEditingUnit(null);
		}
	};

	const deleteUnit = (id) => {
		setUnits(units.filter((unit) => unit.id !== id));
		setSelectedUnits(selectedUnits.filter((unitId) => unitId !== id));
	};

	const toggleSelectUnit = (id) => {
		setSelectedUnits((prevSelected) => (prevSelected.includes(id) ? prevSelected.filter((unitId) => unitId !== id) : [...prevSelected, id]));
	};

	const toggleSelectAll = () => {
		if (selectedUnits.length === filteredUnits.length) {
			setSelectedUnits([]);
		} else {
			setSelectedUnits(filteredUnits.map((unit) => unit.id));
		}
	};

	const deleteSelectedUnits = () => {
		setUnits(units.filter((unit) => !selectedUnits.includes(unit.id)));
		setSelectedUnits([]);
	};

	const filteredUnits = units.filter((unit) => unit.name.toLowerCase().includes(searchTerm.toLowerCase()) || unit.description.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div className="flex flex-col h-screen bg-background">
			<div className="border-b">
				<div className="flex items-center h-16 px-4">
					<PageHeader
						title="Default Units"
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						onAddNew={() => setIsAddDialogOpen(true)}
						addNewText="New Unit"
						onSelectAll={toggleSelectAll}
						isAllSelected={selectedUnits.length === filteredUnits.length && filteredUnits.length > 0}
						onEdit={() => {}} // You might want to implement bulk edit functionality
						onDelete={deleteSelectedUnits}
						selectedCount={selectedUnits.length}
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
								<TableHead>Unit Name</TableHead>
								<TableHead>Description</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredUnits.map((unit) => (
								<TableRow key={unit.id}>
									<TableCell>
										<Checkbox checked={selectedUnits.includes(unit.id)} onCheckedChange={() => toggleSelectUnit(unit.id)} />
									</TableCell>
									<TableCell>{unit.name}</TableCell>
									<TableCell>{unit.description}</TableCell>
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
													<DialogTitle>Edit Unit</DialogTitle>
												</DialogHeader>
												<div className="grid gap-4 py-4">
													<div className="grid items-center grid-cols-4 gap-4">
														<Label htmlFor="editUnitName" className="text-right">
															Unit Name
														</Label>
														<Input id="editUnitName" value={editingUnit?.name || ""} onChange={(e) => setEditingUnit(editingUnit ? { ...editingUnit, name: e.target.value } : null)} className="col-span-3" />
													</div>
													<div className="grid items-center grid-cols-4 gap-4">
														<Label htmlFor="editUnitDescription" className="text-right">
															Description
														</Label>
														<Input id="editUnitDescription" value={editingUnit?.description || ""} onChange={(e) => setEditingUnit(editingUnit ? { ...editingUnit, description: e.target.value } : null)} className="col-span-3" />
													</div>
												</div>
												<DialogFooter>
													<Button onClick={updateUnit}>Save Changes</Button>
												</DialogFooter>
											</DialogContent>
										</Dialog>
										<Button variant="ghost" size="sm" className="w-8 h-8 p-0" onClick={() => deleteUnit(unit.id)}>
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
