"use client";

import { useState } from "react";
import { PlusCircle, Search, MoreHorizontal, Check, Edit2, X, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/page-header";

const initialUsers = [
	{ id: 1, name: "John Doe", email: "john@example.com", role: "Admin", lastActive: "2023-06-01" },
	{ id: 2, name: "Jane Smith", email: "jane@example.com", role: "Estimator", lastActive: "2023-06-05" },
	{ id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Viewer", lastActive: "2023-06-10" },
	{ id: 4, name: "Alice Brown", email: "alice@example.com", role: "Estimator", lastActive: "2023-06-15" },
	{ id: 5, name: "Charlie Davis", email: "charlie@example.com", role: "Admin", lastActive: "2023-06-20" },
];

const roles = ["Admin", "Estimator", "Viewer"];

export default function UserManagement() {
	const [searchTerm, setSearchTerm] = useState("");
	const [users, setUsers] = useState(initialUsers);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [deleteConfirmation, setDeleteConfirmation] = useState("");
	const [usersToDelete, setUsersToDelete] = useState([]);
	const [editingUser, setEditingUser] = useState(null);
	const [editForm, setEditForm] = useState({});

	const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.role.toLowerCase().includes(searchTerm.toLowerCase()));

	const handleSelectAll = () => {
		if (selectedUsers.length === filteredUsers.length) {
			setSelectedUsers([]);
		} else {
			setSelectedUsers(filteredUsers.map((u) => u.id));
		}
	};

	const handleSelectUser = (id) => {
		if (editingUser === null) {
			setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]));
		}
	};

	const handleDeleteSelected = () => {
		const usersToDelete = users.filter((user) => selectedUsers.includes(user.id));
		setUsersToDelete(usersToDelete);
		setIsDeleteDialogOpen(true);
	};

	const confirmDelete = () => {
		if (deleteConfirmation === "DELETE") {
			setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
			setSelectedUsers([]);
			setIsDeleteDialogOpen(false);
			setDeleteConfirmation("");
			setUsersToDelete([]);
		}
	};

	const handleAddUser = (e) => {
		e.preventDefault();
		const newId = Math.max(...users.map((u) => u.id)) + 1;
		setUsers([...users, { ...newUser, id: newId, lastActive: new Date().toISOString().split("T")[0] }]);
		setNewUser({ name: "", email: "", role: "" });
		setIsAddDialogOpen(false);
	};

	const handleEditUser = (user) => {
		setEditingUser(user.id);
		setEditForm(user);
	};

	const handleSaveEdit = () => {
		setUsers(users.map((u) => (u.id === editingUser ? { ...u, ...editForm } : u)));
		setEditingUser(null);
		setEditForm({});
	};

	const handleCancelEdit = () => {
		setEditingUser(null);
		setEditForm({});
	};

	const handleExportSelected = () => {
		// Implement the export functionality here
		console.log("Export selected users");
	};

	return (
		<TooltipProvider>
			<div className="container p-4 mx-auto space-y-4">
				<PageHeader
					title="User Management"
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					onAddNew={() => setIsAddDialogOpen(true)}
					addNewText="New User"
					onSelectAll={handleSelectAll}
					isAllSelected={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
					onEdit={() => {}} // Implement bulk edit functionality if needed
					onDelete={handleDeleteSelected}
					selectedCount={selectedUsers.length}
					totalCount={filteredUsers.length}
					showEdit={false} // Since edit is handled per user card
					showDelete={true}
					onExport={handleExportSelected} // Implement this function if needed
				/>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{filteredUsers.map((user) => {
						const isSelected = selectedUsers.includes(user.id);
						const isEditing = editingUser === user.id;
						return (
							<Card key={user.id} className={cn("flex flex-col cursor-pointer transition-all duration-200", isSelected && "ring-2 ring-primary")} onClick={() => handleSelectUser(user.id)}>
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
															handleSelectUser(user.id);
														} else {
															handleEditUser(user);
														}
													}}
												>
													{isSelected ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
												</Button>
											</TooltipTrigger>
											<TooltipContent>{isSelected ? "Deselect user" : "Edit user"}</TooltipContent>
										</Tooltip>
									)}
									{!isEditing ? (
										<>
											<div className="flex items-start justify-between pr-8 mb-2">
												<Tooltip>
													<TooltipTrigger asChild>
														<h2 className="text-sm font-semibold line-clamp-2">{user.name}</h2>
													</TooltipTrigger>
													<TooltipContent>
														<p>{user.name}</p>
													</TooltipContent>
												</Tooltip>
											</div>
											<div className="flex items-center mb-2 text-xs text-muted-foreground">{user.email}</div>
											<div className="flex items-center mt-2 text-sm font-medium">
												{user.role}
												<Tooltip>
													<TooltipTrigger asChild>
														<Info className="w-3 h-3 ml-1 text-muted-foreground" />
													</TooltipTrigger>
													<TooltipContent>
														<p>User role</p>
													</TooltipContent>
												</Tooltip>
											</div>
											<div className="mt-2 text-xs text-muted-foreground">Last active: {new Date(user.lastActive).toLocaleDateString()}</div>
										</>
									) : (
										<div className="space-y-2">
											<Input value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="User Name" />
											<Input type="email" value={editForm.email || ""} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} placeholder="Email" />
											<Select value={editForm.role || ""} onValueChange={(value) => setEditForm({ ...editForm, role: value })}>
												<SelectTrigger>
													<SelectValue placeholder="Select a role" />
												</SelectTrigger>
												<SelectContent>
													{roles.map((role) => (
														<SelectItem key={role} value={role}>
															{role}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									)}
								</CardContent>
								<CardFooter className="flex justify-end p-2">
									{isEditing && (
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
							<DialogTitle>Delete Users</DialogTitle>
							<DialogDescription>This action cannot be undone. Are you sure you want to delete the following users?</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<ul className="pl-5 list-disc">
								{usersToDelete.map((user) => (
									<li key={user.id}>{user.name}</li>
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
								Delete Users
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</TooltipProvider>
	);
}
