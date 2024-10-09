"use client"

import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, X, ArrowUp, ArrowDown, Trash, Edit, Download, Settings, Info, Tag, Upload, ChevronDown, MoreHorizontal } from "lucide-react"
import EstimationFooter from "./estimation-footer"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import ContentEditable from 'react-contenteditable';
import EasyEdit, { Types } from 'react-easy-edit';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const initialPlumbingItems = [
  {
    id: 1,
    description: "1/2\" Dia Copper Material Pipe",
    quantity: 40,
    wastage: 0.1,
    unit: "LF",
    unitLaborCost: 4,
    unitMaterialCost: 3.1,
    tags: [{ name: "Copper", quantity: 40 }, { name: "Plumbing" }, { name: "Residential" }, { name: "Kitchen" }],
    quantityWithWastage: 44,
    totalLaborCost: 176,
    totalMaterialCost: 134.6,
    itemCost: 311,
  },
  {
    id: 2,
    description: "3/4\" Dia Copper Material Pipe",
    quantity: 370,
    wastage: 0.1,
    unit: "LF",
    unitLaborCost: 4,
    unitMaterialCost: 5,
    tags: [{ name: "Copper", quantity: 370 }, { name: "Plumbing" }, { name: "Commercial" }],
    quantityWithWastage: 407,
    totalLaborCost: 1628,
    totalMaterialCost: 2030.9,
    itemCost: 3659,
  },
  {
    id: 3,
    description: "1\" PVC Pipe",
    quantity: 200,
    wastage: 0.05,
    unit: "LF",
    unitLaborCost: 3,
    unitMaterialCost: 2,
    tags: [{ name: "PVC", quantity: 200 }, { name: "Plumbing" }, { name: "Outdoor" }],
    quantityWithWastage: 210,
    totalLaborCost: 630,
    totalMaterialCost: 420,
    itemCost: 1050,
  },
]

const initialColumnConfig = [
  { key: 'description', label: 'Line Item', visible: true },
  { key: 'quantity', label: 'Qty.', visible: true },
  { key: 'wastage', label: 'Wastage', visible: true },
  { key: 'quantityWithWastage', label: 'Qty w/ Wastage', visible: true },
  { key: 'unit', label: 'Unit', visible: true },
  { key: 'unitLaborCost', label: 'Unit Labor Cost', visible: true },
  { key: 'totalLaborCost', label: 'Total Labor Cost', visible: true },
  { key: 'unitMaterialCost', label: 'Unit Material Cost', visible: true },
  { key: 'totalMaterialCost', label: 'Total Material Cost', visible: true },
  { key: 'itemCost', label: 'Item Cost', visible: true },
]

const editableColumns = ['description', 'quantity', 'wastage', 'unit', 'unitLaborCost', 'unitMaterialCost'];

// Custom InlineEdit component
const InlineEdit = ({ value, onSave, type, format }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSave(editValue);
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        autoFocus
        style={{
          width: '100%',
          padding: '0.25rem',
          border: '1px solid #ccc',
          borderRadius: '0.25rem',
        }}
      />
    );
  }

  return (
    <div onClick={() => setIsEditing(true)} className="p-1 cursor-pointer">
      {format ? format(value) : value}
    </div>
  );
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function PlumbingItemsTable() {
  const [plumbingItems, setPlumbingItems] = useState(initialPlumbingItems)
  const [sortColumn, setSortColumn] = useState('description')
  const [sortDirection, setSortDirection] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [columnConfig, setColumnConfig] = useState(initialColumnConfig)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadContent, setUploadContent] = useState('')
  const [isManageTagsOpen, setIsManageTagsOpen] = useState(false)
  const [isManageColumnsOpen, setIsManageColumnsOpen] = useState(false)
  const [tagSearchTerm, setTagSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedTagForBreakdown, setSelectedTagForBreakdown] = useState(null)
  const [footerHeight, setFooterHeight] = useState(0);
  const footerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('items')
  const [editingTag, setEditingTag] = useState(null);

  useEffect(() => {
    if (footerRef.current) {
      setFooterHeight(footerRef.current.offsetHeight);
    }
  }, []);

  const calculateItemTotals = useCallback((item) => {
    const quantityWithWastage = item.quantity * (1 + item.wastage);
    const totalLaborCost = quantityWithWastage * item.unitLaborCost;
    const totalMaterialCost = quantityWithWastage * item.unitMaterialCost;
    const itemCost = totalLaborCost + totalMaterialCost;

    return {
      ...item,
      quantityWithWastage,
      totalLaborCost,
      totalMaterialCost,
      itemCost,
    };
  }, []);

  const handleContentChange = useCallback((itemId, key, value) => {
    setPlumbingItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          let newValue = value;
          if (key === 'wastage') {
            newValue = parseFloat(value) / 100;
          } else if (['quantity', 'unitLaborCost', 'unitMaterialCost'].includes(key)) {
            newValue = parseFloat(value);
          }
          return calculateItemTotals({ ...item, [key]: newValue });
        }
        return item;
      })
    );
  }, [calculateItemTotals]);

  useEffect(() => {
    const savedConfig = localStorage.getItem('plumbingItemsColumnConfig')
    if (savedConfig) {
      try {
        setColumnConfig(JSON.parse(savedConfig))
      } catch (error) {
        console.error('Error parsing saved column config:', error)
      }
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('plumbingItemsColumnConfig', JSON.stringify(columnConfig))
    } catch (error) {
      console.error('Error saving column config:', error)
    }
  }, [columnConfig])

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const addTag = useCallback((itemId, newTag) => {
    setPlumbingItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? calculateItemTotals({ ...item, tags: [...item.tags, newTag] })
          : item
      )
    )
  }, [calculateItemTotals])

  const removeTag = useCallback((itemId, tagName) => {
    setPlumbingItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? {...item, tags: item.tags.filter(tag => tag.name !== tagName)}
          : item
      )
    );
  }, []);

  const updateTag = useCallback((itemId, oldTagName, updatedTag) => {
    setPlumbingItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? {...item, tags: item.tags.map(tag => 
              tag.name === oldTagName ? {...tag, ...updatedTag} : tag
            )}
          : item
      )
    );
  }, []);

  const addLineItem = () => {
    const newItem = {
      id: plumbingItems.length + 1,
      description: "New Line Item",
      quantity: 0,
      wastage: 0,
      unit: "EA",
      unitLaborCost: 0,
      unitMaterialCost: 0,
      tags: [],
      quantityWithWastage: 0,
      totalLaborCost: 0,
      totalMaterialCost: 0,
      itemCost: 0,
    }
    setPlumbingItems(prevItems => [...prevItems, calculateItemTotals(newItem)])
  }

  const handleUpload = () => {
    console.log("Uploading items:", uploadContent)
    setIsUploadModalOpen(false)
    setUploadContent('')
  }

  const sortedItems = [...plumbingItems].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const filteredItems = sortedItems.filter(item =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedTags.length === 0 || selectedTags.every(tag => item.tags.some(t => t.name === tag)))
  )

  const allTags = Array.from(new Set(plumbingItems.flatMap(item => item.tags.map(tag => tag.name))))

  const filteredTags = allTags.filter(tag =>
    tag.toLowerCase().includes(tagSearchTerm.toLowerCase())
  )

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(filteredItems.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    )
  }

  const handleDeleteSelected = () => {
    setPlumbingItems(prev => prev.filter(item => !selectedItems.includes(item.id)))
    setSelectedItems([])
  }

  const handleExportSelected = () => {
    console.log("Exporting selected items:", selectedItems)
  }

  const handleEditSelected = () => {
    console.log("Editing selected items:", selectedItems)
  }

  const toggleColumnVisibility = (key) => {
    setColumnConfig(prev =>
      prev.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    )
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const calculateTagBreakdowns = useCallback(() => {
    const breakdowns = {}
    plumbingItems.forEach(item => {
      item.tags.forEach(tag => {
        if (!breakdowns[tag.name]) {
          breakdowns[tag.name] = {
            totalQuantity: 0,
            totalLaborCost: 0,
            totalMaterialCost: 0,
            totalItemCost: 0,
            items: []
          }
        }
        const tagQuantity = tag.quantity !== undefined ? tag.quantity : item.quantity
        breakdowns[tag.name].totalQuantity += tagQuantity
        breakdowns[tag.name].totalLaborCost += (tagQuantity / item.quantity) * item.totalLaborCost
        breakdowns[tag.name].totalMaterialCost += (tagQuantity / item.quantity) * item.totalMaterialCost
        breakdowns[tag.name].totalItemCost += (tagQuantity / item.quantity) * item.itemCost
        breakdowns[tag.name].items.push({
          description: item.description,
          quantity: tagQuantity,
          laborCost: (tagQuantity / item.quantity) * item.totalLaborCost,
          materialCost: (tagQuantity / item.quantity) * item.totalMaterialCost,
          itemCost: (tagQuantity / item.quantity) * item.itemCost
        })
      })
    })
    return breakdowns
  }, [plumbingItems])

  const tagBreakdowns = useMemo(calculateTagBreakdowns, [calculateTagBreakdowns])

  const filterItemsByTag = (tag) => {
    setSearchTerm('')
    setSelectedTags([tag])
  }

  const totals = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      acc.totalLaborCost += item.totalLaborCost;
      acc.totalMaterialCost += item.totalMaterialCost;
      return acc;
    }, { totalLaborCost: 0, totalMaterialCost: 0 });
  }, [filteredItems]);

  const lineItemCount = filteredItems.length;

  const SortableHeader = ({ column, children }) => (
    <TableHead className="text-left">
      <button
        onClick={() => handleSort(column)}
        className="flex items-center justify-between w-full font-medium text-left text-muted-foreground hover:text-foreground"
      >
        {children}
        <span className="ml-2">
          {sortColumn === column && sortDirection === 'asc' && <ArrowUp className="w-4 h-4" />}
          {sortColumn === column && sortDirection === 'desc' && <ArrowDown className="w-4 h-4" />}
          {sortColumn !== column && (
            <span className="text-transparent select-none">
              <ArrowUp className="w-4 h-4" />
            </span>
          )}
        </span>
      </button>
    </TableHead>
  )

  const handleTagEdit = (itemId, tagIndex, updatedTag) => {
    setPlumbingItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? {
              ...item,
              tags: item.tags.map((tag, index) =>
                index === tagIndex ? { ...tag, ...updatedTag } : tag
              )
            }
          : item
      )
    );
    setEditingTag(null);
  };

  const handleTagDelete = (itemId, tagIndex) => {
    setPlumbingItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, tags: item.tags.filter((_, index) => index !== tagIndex) }
          : item
      )
    );
  };

  return (
    <div className="p-4 mx-auto space-y-4" style={{ paddingBottom: `${footerHeight + 20}px` }}>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Plumbing Line Items</h1>
        <div className="flex flex-col items-center w-full space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:w-auto">
          <div className="relative flex-grow w-full sm:w-64">
            <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search items..."
              className="w-full h-10 pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="h-10" onClick={addLineItem}>
                  <Plus className="w-4 h-4 mr-2" /> Add Line Item
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new plumbing item to your list</p>
              </TooltipContent>
            </Tooltip>
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
                <DropdownMenuItem onClick={() => setIsUploadModalOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" /> Upload Multiple Items
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => {
                  e.preventDefault();
                  setIsManageTagsOpen(true);
                }}>
                  <Tag className="w-4 h-4 mr-2" /> Manage Tags
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => {
                  e.preventDefault();
                  setIsManageColumnsOpen(true);
                }}>
                  <Settings className="w-4 h-4 mr-2" /> Manage Columns
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleEditSelected} disabled={selectedItems.length === 0}>
                  <Edit className="w-4 h-4 mr-2" /> Edit Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteSelected} disabled={selectedItems.length === 0}>
                  <Trash className="w-4 h-4 mr-2" /> Delete Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportSelected} disabled={selectedItems.length === 0}>
                  <Download className="w-4 h-4 mr-2" /> Export Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {selectedTags.length > 0 && (
        <div className="mb-4">
          <Label className="block mb-2">Filtered Tags:</Label>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs"
              >
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-4 h-4 p-0 ml-2"
                  onClick={() => toggleTag(tag)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Line Items</TabsTrigger>
          <TabsTrigger value="tags">Tag Breakdowns</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  {columnConfig.filter(col => col.visible).map(col => (
                    <SortableHeader key={col.key} column={col.key}>{col.label}</SortableHeader>
                  ))}
                  <TableHead className="text-left">Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map(item => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="w-[50px]">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                        aria-label={`Select ${item.description}`}
                      />
                    </TableCell>
                    {columnConfig.filter(col => col.visible).map(col => (
                      <TableCell key={col.key} className="text-left">
                        {editableColumns.includes(col.key) ? (
                          <InlineEdit
                            value={
                              col.key === 'wastage'
                                ? (item[col.key] * 100).toFixed(0)
                                : col.key === 'quantity'
                                  ? item[col.key].toString()
                                  : col.key.toLowerCase().includes('cost')
                                    ? item[col.key].toFixed(2)
                                    : item[col.key].toString()
                            }
                            onSave={(value) => handleContentChange(item.id, col.key, value)}
                            type={col.key === 'description' || col.key === 'unit' ? 'text' : 'number'}
                            format={(value) => 
                              col.key === 'wastage'
                                ? `${value}%`
                                : col.key.toLowerCase().includes('cost')
                                  ? `$${parseFloat(value).toFixed(2)}`
                                  : value
                            }
                          />
                        ) : (
                          <div className="p-1">
                            {col.key === 'wastage'
                              ? `${(item[col.key] * 100).toFixed(0)}%`
                              : col.key === 'quantityWithWastage' 
                                ? Math.ceil(item[col.key]).toString()
                                : typeof item[col.key] === 'number' 
                                  ? col.key.toLowerCase().includes('cost') 
                                    ? `$${item[col.key].toFixed(2)}`
                                    : item[col.key].toString()
                                  : item[col.key] || ''}
                          </div>
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1">
                        {item.tags.map((tag, index) => (
                          editingTag === `${item.id}-${index}` ? (
                            <form
                              key={`${item.id}-${index}`}
                              onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                handleTagEdit(item.id, index, {
                                  name: formData.get('tagName'),
                                  quantity: formData.get('tagQuantity') ? Number(formData.get('tagQuantity')) : undefined
                                });
                              }}
                              className="flex items-center space-x-1"
                            >
                              <Input
                                name="tagName"
                                defaultValue={tag.name}
                                className="w-20 h-6 text-xs"
                                autoFocus
                              />
                              <Input
                                name="tagQuantity"
                                type="number"
                                defaultValue={tag.quantity}
                                className="w-16 h-6 text-xs"
                              />
                              <Button type="submit" size="sm" className="h-6 px-2 py-0">Save</Button>
                            </form>
                          ) : (
                            <Badge
                              key={`${item.id}-${index}`}
                              variant="secondary"
                              className="text-xs cursor-pointer hover:bg-secondary/80"
                              onClick={() => setEditingTag(`${item.id}-${index}`)}
                            >
                              {tag.name} {tag.quantity !== undefined && `(${tag.quantity})`}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-4 h-4 p-0 ml-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTagDelete(item.id, index);
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </Badge>
                          )
                        ))}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="icon" className="w-6 h-6 rounded-full">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <TagForm 
                              onSubmit={(newTag) => addTag(item.id, newTag)} 
                              unit={item.unit} 
                              allTags={allTags}  // Pass the allTags array here
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="tags">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(tagBreakdowns).map(([tagName, breakdown]) => (
              <Card key={tagName} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    {tagName}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTags([tagName]);
                      setActiveTab('items');
                    }}
                  >
                    View Items
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(breakdown.totalItemCost)}</div>
                  <p className="text-xs text-muted-foreground">
                    Total Quantity: {breakdown.totalQuantity.toFixed(2)}
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Labor:</span>
                      <span>{formatCurrency(breakdown.totalLaborCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Material:</span>
                      <span>{formatCurrency(breakdown.totalMaterialCost)}</span>
                    </div>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 mt-4"
                    onClick={() => setSelectedTagForBreakdown(tagName)}
                  >
                    View Breakdown
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg w-96">
            <h2 className="mb-4 text-xl font-bold">Upload Items</h2>
            <Textarea
              value={uploadContent}
              onChange={(e) => setUploadContent(e.target.value)}
              placeholder="Paste your CSV or comma-delimited content here..."
              className="mb-4"
              rows={10}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
              <Button onClick={handleUpload}>Upload</Button>
            </div>
          </div>
        </div>
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
                  <Checkbox
                    id={`column-${col.key}`}
                    checked={col.visible}
                    onCheckedChange={() => toggleColumnVisibility(col.key)}
                  />
                  <Label htmlFor={`column-${col.key}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {col.label}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <Dialog open={isManageTagsOpen} onOpenChange={setIsManageTagsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tags"
                value={tagSearchTerm}
                onChange={(e) => setTagSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <ScrollArea className="h-[240px]">
              <div className="space-y-2">
                {filteredTags.map(tag => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    <Label htmlFor={`tag-${tag}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!selectedTagForBreakdown} onOpenChange={() => setSelectedTagForBreakdown(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedTagForBreakdown} Breakdown</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Labor Cost</TableHead>
                <TableHead>Material Cost</TableHead>
                <TableHead>Item Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedTagForBreakdown &&
                tagBreakdowns[selectedTagForBreakdown].items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity.toFixed(2)}</TableCell>
                    <TableCell>{formatCurrency(item.laborCost)}</TableCell>
                    <TableCell>{formatCurrency(item.materialCost)}</TableCell>
                    <TableCell>{formatCurrency(item.itemCost)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
      <EstimationFooter 
        ref={footerRef}
        lineItemCount={lineItemCount}
        totalLaborCost={totals.totalLaborCost}
        totalMaterialCost={totals.totalMaterialCost}
      />
    </div>
  )
}

function TagForm({ onSubmit, onDelete, unit, existingTag = null, allTags }) {
  const [tagName, setTagName] = useState(existingTag ? existingTag.name : '')
  const [tagQuantity, setTagQuantity] = useState(existingTag && existingTag.quantity !== undefined ? existingTag.quantity : undefined)
  const [includeQuantity, setIncludeQuantity] = useState(existingTag ? existingTag.quantity !== undefined : false)
  const [isNewTag, setIsNewTag] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (tagName) {
      onSubmit({ name: tagName, quantity: includeQuantity ? tagQuantity : undefined })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tagName">Tag Name</Label>
        {isNewTag ? (
          <Input
            id="tagName"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Enter new tag name"
          />
        ) : (
          <Select
            onValueChange={(value) => {
              if (value === "new") {
                setIsNewTag(true)
                setTagName("")
              } else {
                setTagName(value)
              }
            }}
            defaultValue={tagName}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a tag" />
            </SelectTrigger>
            <SelectContent>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
              <SelectItem value="new">Add new tag</SelectItem>
            </SelectContent>
          </Select>
        )}
        {isNewTag && (
          <Button type="button" variant="outline" size="sm" onClick={() => setIsNewTag(false)}>
            Back to existing tags
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="include-quantity"
          checked={includeQuantity}
          onCheckedChange={setIncludeQuantity}
        />
        <Label htmlFor="include-quantity">Include Quantity</Label>
      </div>
      {includeQuantity && (
        <div className="space-y-2">
          <Label htmlFor="tagQuantity">Quantity ({unit})</Label>
          <Input
            id="tagQuantity"
            type="number"
            value={tagQuantity ?? ''}
            onChange={(e) => setTagQuantity(e.target.value ? Number(e.target.value) : undefined)}
            placeholder={`Enter quantity in ${unit}`}
            min="0"
            step="0.01"
          />
        </div>
      )}
      <div className="flex justify-between">
        <Button type="submit">{existingTag ? 'Update Tag' : 'Add Tag'}</Button>
        {existingTag && (
          <Button type="button" variant="destructive" onClick={onDelete}>Delete Tag</Button>
        )}
      </div>
    </form>
  )
}