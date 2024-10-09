"use client"

import { useState } from "react"
import { PlusCircle, Search, MoreHorizontal, Check, ChevronRight, Calendar, Edit2, X, Info } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import PageHeader from "@/components/page-header";

const initialEstimates = [
	{ id: 1, name: "Residential Plumbing Project", total: 15000, date: "2023-06-01" },
	{ id: 2, name: "Commercial HVAC Installation", total: null, date: "2023-06-05" },
	{ id: 3, name: "Kitchen Renovation", total: 25000, date: "2023-06-10" },
	{ id: 4, name: "Office Building Electrical", total: null, date: "2023-06-15" },
	{ id: 5, name: "Bathroom Remodel with Extended Scope and Additional Features", total: 10000, date: "2023-06-20" },
];

export default function ImprovedEstimatesPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [estimates, setEstimates] = useState(initialEstimates);
	const [selectedEstimates, setSelectedEstimates] = useState([]);
	const [newEstimate, setNewEstimate] = useState({ name: "", date: "" });
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [deleteConfirmation, setDeleteConfirmation] = useState("");
	const [estimatesToDelete, setEstimatesToDelete] = useState([]);
	const [editingEstimate, setEditingEstimate] = useState(null);
	const [editForm, setEditForm] = useState({});

	const filteredEstimates = estimates.filter((estimate) => estimate.name.toLowerCase().includes(searchTerm.toLowerCase()));

	const handleSelectAll = () => {
		if (selectedEstimates.length === filteredEstimates.length) {
			setSelectedEstimates([]);
		} else {
			setSelectedEstimates(filteredEstimates.map((e) => e.id));
		}
	};

	const handleSelectEstimate = (id) => {
		if (editingEstimate === null) {
			setSelectedEstimates((prev) => (prev.includes(id) ? prev.filter((estimateId) => estimateId !== id) : [...prev, id]));
		}
	};

	const handleDeleteSelected = () => {
		const estimatesToDelete = estimates.filter((estimate) => selectedEstimates.includes(estimate.id));
		setEstimatesToDelete(estimatesToDelete);
		setIsDeleteDialogOpen(true);
	};

	const confirmDelete = () => {
		if (deleteConfirmation === "DELETE") {
			setEstimates(estimates.filter((estimate) => !selectedEstimates.includes(estimate.id)));
			setSelectedEstimates([]);
			setIsDeleteDialogOpen(false);
			setDeleteConfirmation("");
			setEstimatesToDelete([]);
		}
	};

	const handleAddEstimate = (e) => {
		e.preventDefault();
		const newId = Math.max(...estimates.map((e) => e.id)) + 1;
		setEstimates([...estimates, { ...newEstimate, id: newId, total: null }]);
		setNewEstimate({ name: "", date: "" });
		setIsAddDialogOpen(false);
	};

	const handleEditEstimate = (estimate) => {
		setEditingEstimate(estimate.id);
		setEditForm(estimate);
	};

	const handleSaveEdit = () => {
		setEstimates(estimates.map((e) => (e.id === editingEstimate ? { ...e, ...editForm } : e)));
		setEditingEstimate(null);
		setEditForm({});
	};

	const handleCancelEdit = () => {
		setEditingEstimate(null);
		setEditForm({});
	};

	return (
		<TooltipProvider>
			<div className="container p-4 mx-auto space-y-4">
				<PageHeader title="Estimates" searchTerm={searchTerm} setSearchTerm={setSearchTerm} onAddNew={() => setIsAddDialogOpen(true)} addNewText="New Estimate" />
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{filteredEstimates.map((estimate) => {
						const isSelected = selectedEstimates.includes(estimate.id);
						const isEditing = editingEstimate === estimate.id;
						return (
							<Card key={estimate.id} className={cn("flex flex-col cursor-pointer transition-all duration-200", isSelected && "ring-2 ring-primary")} onClick={() => handleSelectEstimate(estimate.id)}>
								<CardContent className="relative flex flex-col p-4">
									{!isEditing && (
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className={cn("absolute top-2 right-2 h-6 w-6 p-0 z-10", isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground")}
													onClick={(e) => {
														e.stopPropagation();
														if (isSelected) {
															handleSelectEstimate(estimate.id);
														} else {
															handleEditEstimate(estimate);
														}
													}}
												>
													{isSelected ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
												</Button>
											</TooltipTrigger>
											<TooltipContent>{isSelected ? "Deselect estimate" : "Edit estimate"}</TooltipContent>
										</Tooltip>
									)}
									{!isEditing ? (
										<>
											<div className="flex items-start justify-between pr-8 mb-2">
												<Tooltip>
													<TooltipTrigger asChild>
														<h2 className="text-sm font-semibold line-clamp-2">{estimate.name}</h2>
													</TooltipTrigger>
													<TooltipContent>
														<p>{estimate.name}</p>
													</TooltipContent>
												</Tooltip>
											</div>
											<div className="flex items-center mb-2 text-xs text-muted-foreground">
												<Calendar className="flex-shrink-0 w-3 h-3 mr-1" />
												{new Date(estimate.date).toLocaleDateString()}
											</div>
											<div className="flex items-center mt-2 text-sm font-medium">
												{estimate.total !== null ? `$${estimate.total.toLocaleString()}` : <span className="text-muted-foreground">Pending total</span>}
												<Tooltip>
													<TooltipTrigger asChild>
														<Info className="w-3 h-3 ml-1 text-muted-foreground" />
													</TooltipTrigger>
													<TooltipContent>
														<p>{estimate.total !== null ? "Total estimate amount" : "Estimate total not yet calculated"}</p>
													</TooltipContent>
												</Tooltip>
											</div>
										</>
									) : (
										<div className="space-y-2">
											<Input value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Estimate Name" />
											<Input type="date" value={editForm.date || ""} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} />
											<Input type="number" value={editForm.total || ""} onChange={(e) => setEditForm({ ...editForm, total: parseFloat(e.target.value) || null })} placeholder="Total (optional)" />
										</div>
									)}
								</CardContent>
								<CardFooter className="flex justify-end p-2">
									{!isEditing ? (
										<Tooltip>
											<TooltipTrigger asChild>
												<Link href="/admin/build" passHref legacyBehavior>
													<Button variant="outline" size="sm" as="a">
														View Details
													</Button>
												</Link>
											</TooltipTrigger>
											<TooltipContent>
												<p>View full estimate details</p>
											</TooltipContent>
										</Tooltip>
									) : (
										<>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button variant="outline" size="sm" onClick={handleCancelEdit} className="mr-2">
														<X className="w-4 h-4 mr-2" /> Cancel
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													<p>Cancel editing</p>
												</TooltipContent>
											</Tooltip>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button size="sm" onClick={handleSaveEdit}>
														<Check className="w-4 h-4 mr-2" /> Save
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													<p>Save changes</p>
												</TooltipContent>
											</Tooltip>
										</>
									)}
								</CardFooter>
							</Card>
						);
					})}
				</div>
				<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Delete Estimates</DialogTitle>
							<DialogDescription>This action cannot be undone. Are you sure you want to delete the following estimates?</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<ul className="pl-5 list-disc">
								{estimatesToDelete.map((estimate) => (
									<li key={estimate.id}>{estimate.name}</li>
								))}
							</ul>
							<p>Type DELETE to confirm:</p>
							<Input placeholder="Type DELETE to confirm" value={deleteConfirmation} onChange={(e) => setDeleteConfirmation(e.target.value)} />
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
								Cancel
							</Button>
							<Button variant="destructive" onClick={confirmDelete} disabled={deleteConfirmation !== "DELETE"}>
								Delete Estimates
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</TooltipProvider>
	);
}