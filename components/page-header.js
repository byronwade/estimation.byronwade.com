import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, Edit, Trash, MoreHorizontal, Upload, Tag, Settings, Download } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const PageHeader = ({ title, searchTerm, setSearchTerm, onAddNew, addNewText, onSelectAll, isAllSelected, onEdit, onDelete, selectedCount, totalCount, showSelectAll = true, showSearch = true, showAddNew = true, showEdit = true, showDelete = true, showMoreOptions = true, onUpload, onManageTags, onManageColumns, onExport }) => {
	return (
		<div className="flex flex-col items-start justify-between w-full gap-4 sm:flex-row sm:items-center">
			<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
			<div className="flex items-center ml-auto space-x-2">
				{showSearch && (
					<div className="relative">
						<Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
						<Input type="text" placeholder={`Search ${title.toLowerCase()}...`} className="w-64 h-10 pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
					</div>
				)}
				{showSelectAll && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant={isAllSelected ? "default" : "outline"} onClick={onSelectAll}>
									{isAllSelected ? `Deselect All (${selectedCount})` : selectedCount > 0 ? `Select All (${selectedCount})` : "Select All"}
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>{isAllSelected ? "Deselect All" : "Select All"}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
				{showEdit && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="outline" size="icon" onClick={onEdit} disabled={selectedCount === 0}>
									<Edit className="w-4 h-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Edit selected {selectedCount === 1 ? "item" : "items"}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
				{showDelete && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="outline" size="icon" onClick={onDelete} disabled={selectedCount === 0}>
									<Trash className="w-4 h-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Delete selected {selectedCount === 1 ? "item" : "items"}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
				{showAddNew && (
					<Dialog>
						<DialogTrigger asChild>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button className="h-10" onClick={onAddNew}>
											<PlusCircle className="w-4 h-4 mr-2" /> {addNewText}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Add a new {title.toLowerCase().slice(0, -1)} to the system</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</DialogTrigger>
					</Dialog>
				)}
				{showMoreOptions && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="w-10 h-10 p-0">
								<MoreHorizontal className="w-4 h-4" />
								<span className="sr-only">More options</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{onUpload && (
								<DropdownMenuItem onClick={onUpload}>
									<Upload className="w-4 h-4 mr-2" /> Upload Multiple Items
								</DropdownMenuItem>
							)}
							{(onManageTags || onManageColumns) && <DropdownMenuSeparator />}
							{onManageTags && (
								<DropdownMenuItem onClick={onManageTags}>
									<Tag className="w-4 h-4 mr-2" /> Manage Tags
								</DropdownMenuItem>
							)}
							{onManageColumns && (
								<DropdownMenuItem onClick={onManageColumns}>
									<Settings className="w-4 h-4 mr-2" /> Manage Columns
								</DropdownMenuItem>
							)}
							{onExport && (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={onExport} disabled={selectedCount === 0}>
										<Download className="w-4 h-4 mr-2" /> Export Selected
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</div>
	);
};

export default PageHeader;
