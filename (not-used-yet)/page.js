"use client"

import { useState } from "react"
import { PlusCircle, Search, MoreHorizontal, Check, MapPin, Calendar, Trash2, X, Edit2, Info } from "lucide-react"

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

const initialProjects = [
  { id: 1, name: "City Center Renovation", location: "New York, NY", date: "2023-10-15", estimatesCount: 3 },
  { id: 2, name: "Suburban Home Development", location: "Los Angeles, CA", date: "2023-11-01", estimatesCount: 5 },
  { id: 3, name: "Commercial Complex", location: "Chicago, IL", date: "2023-09-22", estimatesCount: 2 },
  { id: 4, name: "Industrial Warehouse Upgrade", location: "Houston, TX", date: "2023-10-30", estimatesCount: 4 },
  { id: 5, name: "School Renovation Project with an Extremely Long Name That Might Cause UI Issues", location: "Boston, MA", date: "2023-11-15", estimatesCount: 6 },
]

export default function ImprovedProjectsPageWithTooltips() {
  const [searchTerm, setSearchTerm] = useState("")
  const [projects, setProjects] = useState(initialProjects)
  const [selectedProjects, setSelectedProjects] = useState([])
  const [newProject, setNewProject] = useState({ name: "", location: "", date: "" })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [projectsToDelete, setProjectsToDelete] = useState([])
  const [editingProject, setEditingProject] = useState(null)
  const [editForm, setEditForm] = useState({})

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([])
    } else {
      setSelectedProjects(filteredProjects.map(e => e.id))
    }
  }

  const handleSelectProject = (id) => {
    if (editingProject === null) {
      setSelectedProjects(prev =>
        prev.includes(id) ? prev.filter(projectId => projectId !== id) : [...prev, id]
      )
    }
  }

  const handleDeleteSelected = () => {
    const projectsToDelete = projects.filter(project => selectedProjects.includes(project.id))
    setProjectsToDelete(projectsToDelete)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deleteConfirmation === "DELETE") {
      setProjects(projects.filter(project => !selectedProjects.includes(project.id)))
      setSelectedProjects([])
      setIsDeleteDialogOpen(false)
      setDeleteConfirmation("")
      setProjectsToDelete([])
    }
  }

  const handleAddProject = (e) => {
    e.preventDefault()
    const newId = Math.max(...projects.map(e => e.id)) + 1
    setProjects([...projects, { ...newProject, id: newId, estimatesCount: 0 }])
    setNewProject({ name: "", location: "", date: "" })
    setIsAddDialogOpen(false)
  }

  const handleEditProject = (project) => {
    setEditingProject(project.id)
    setEditForm(project)
  }

  const handleSaveEdit = () => {
    setProjects(projects.map(p => p.id === editingProject ? { ...p, ...editForm } : p))
    setEditingProject(null)
    setEditForm({})
  }

  const handleCancelEdit = () => {
    setEditingProject(null)
    setEditForm({})
  }

  return (
    <TooltipProvider>
      <div className="container p-4 mx-auto space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-grow">
            <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search projects..."
              className="w-full h-10 pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="h-10">
                      <PlusCircle className="w-4 h-4 mr-2" /> New Project
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add a new project to your list</p>
                  </TooltipContent>
                </Tooltip>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new project here. Click save when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddProject}>
                  <div className="grid gap-4 py-4">
                    <div className="grid items-center grid-cols-4 gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid items-center grid-cols-4 gap-4">
                      <Label htmlFor="location" className="text-right">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={newProject.location}
                        onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid items-center grid-cols-4 gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={newProject.date}
                        onChange={(e) => setNewProject({ ...newProject, date: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-10 h-10 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>More options</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSelectAll}>
                  {selectedProjects.length === filteredProjects.length ? "Deselect All" : "Select All"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteSelected}
                  disabled={selectedProjects.length === 0}
                  className="text-destructive"
                >
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProjects.map((project) => {
            const isSelected = selectedProjects.includes(project.id)
            const isEditing = editingProject === project.id
            return (
              <Card
                key={project.id}
                className={cn(
                  "flex flex-col cursor-pointer transition-all duration-200",
                  isSelected && "ring-2 ring-primary"
                )}
                onClick={() => handleSelectProject(project.id)}
              >
                <CardContent className="relative flex flex-col p-4">
                  {!isEditing && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "absolute top-2 right-2 h-6 w-6 p-0 z-10",
                            isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                          )}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (isSelected) {
                              handleSelectProject(project.id)
                            } else {
                              handleEditProject(project)
                            }
                          }}
                        >
                          {isSelected ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Edit2 className="w-4 h-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isSelected ? "Deselect project" : "Edit project"}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {!isEditing ? (
                    <>
                      <div className="flex items-start justify-between pr-8 mb-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <h2 className="text-sm font-semibold line-clamp-2">
                              {project.name}
                            </h2>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{project.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex items-center mb-2 text-xs text-muted-foreground">
                        <MapPin className="flex-shrink-0 w-3 h-3 mr-1" />
                        <span className="truncate">{project.location}</span>
                      </div>
                      <div className="flex items-center mb-2 text-xs text-muted-foreground">
                        <Calendar className="flex-shrink-0 w-3 h-3 mr-1" />
                        {new Date(project.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center mt-2 text-sm font-medium">
                        {project.estimatesCount} Estimates
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 ml-1 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Number of estimates associated with this project</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Project Name"
                      />
                      <Input
                        value={editForm.location || ''}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        placeholder="Location"
                      />
                      <Input
                        type="date"
                        value={editForm.date || ''}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end p-2">
                  {!isEditing ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View full project details and estimates</p>
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
            )
          })}
        </div>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Projects</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to delete the following projects?
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <ul className="pl-5 list-disc">
                {projectsToDelete.map(project => (
                  <li key={project.id}>{project.name}</li>
                ))}
              </ul>
              <p>Type DELETE to confirm:</p>
              <Input
                placeholder="Type DELETE to confirm"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteConfirmation !== "DELETE"}
              >
                Delete Projects
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}