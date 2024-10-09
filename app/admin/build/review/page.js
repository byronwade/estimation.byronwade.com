'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Printer, Tag, Settings } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import PdfOverview from './pdf-overview'
import { ArrowLeft } from "lucide-react"
import Link from 'next/link'

// Mock data - replace with actual data from your database
const initialData = {
  directLabor: 75743,
  materialCost: 149257,
  permit: 3550,
  equipRental: 4730,
  labeling: 1500,
  overheadMarkup: 0.45,
  salesTax: 0.08,
  laborMarkup: 34084.31,
  materialMarkup: 77292,
}

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

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const formatPercentage = (value) => {
  return `${(value * 100).toFixed(2)}%`
}

// Mock average percentages
const averagePercentages = {
  overheadMarkup: 42,
  salesTax: 7.5,
  laborMarkup: 40,
}

export default function Component() {
  const [data, setData] = useState(initialData)
  const [plumbingItems, setPlumbingItems] = useState(initialPlumbingItems)
  const [overheadMarkupPercentage, setOverheadMarkupPercentage] = useState(45)
  const [salesTaxPercentage, setSalesTaxPercentage] = useState(8)
  const [laborMarkupPercentage, setLaborMarkupPercentage] = useState(45)
  const [selectedTagForBreakdown, setSelectedTagForBreakdown] = useState(null)
  const [pdfOptions, setPdfOptions] = useState({
    showLabels: true,
    showTotalsOnly: false,
    showCompanyLogo: true,
    showCustomerInfo: true,
    showTagTotals: true,
    showBasicVersion: false,
  })

  const updateField = (field, value) => {
    setData(prevData => ({
      ...prevData,
      [field]: parseFloat(value) || 0
    }))
  }

  const calculateTotals = () => {
    const subtotal = data.materialCost + data.permit + data.equipRental + data.labeling
    const tax = subtotal * (salesTaxPercentage / 100)
    const overheadMarkup = data.directLabor * (overheadMarkupPercentage / 100)
    const laborMarkup = data.directLabor * (laborMarkupPercentage / 100)
    const totalMaterialCost = subtotal + tax
    const totalLaborCost = data.directLabor + overheadMarkup + laborMarkup
    const totalBid = totalMaterialCost + totalLaborCost
    const totalProfit = overheadMarkup + laborMarkup + data.materialMarkup
    const profitMargin = totalProfit / totalBid

    return {
      subtotal,
      tax,
      overheadMarkup,
      laborMarkup,
      totalMaterialCost,
      totalLaborCost,
      totalBid,
      totalProfit,
      profitMargin
    }
  }

  const totals = calculateTotals()

  const calculateTagBreakdowns = useMemo(() => {
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
        const tagLaborCost = (tagQuantity / item.quantity) * item.totalLaborCost
        const tagMaterialCost = (tagQuantity / item.quantity) * item.totalMaterialCost
        const tagItemCost = tagLaborCost + tagMaterialCost

        breakdowns[tag.name].totalQuantity += tagQuantity
        breakdowns[tag.name].totalLaborCost += tagLaborCost
        breakdowns[tag.name].totalMaterialCost += tagMaterialCost
        breakdowns[tag.name].totalItemCost += tagItemCost
        breakdowns[tag.name].items.push({
          description: item.description,
          quantity: tagQuantity,
          laborCost: tagLaborCost,
          materialCost: tagMaterialCost,
          itemCost: tagItemCost
        })
      })
    })

    Object.keys(breakdowns).forEach(tagName => {
      const tagTotal = breakdowns[tagName].totalItemCost
      const tagOverhead = breakdowns[tagName].totalLaborCost * (overheadMarkupPercentage / 100)
      const tagLaborMarkup = breakdowns[tagName].totalLaborCost * (laborMarkupPercentage / 100)
      const tagSalesTax = breakdowns[tagName].totalMaterialCost * (salesTaxPercentage / 100)
      
      breakdowns[tagName].overhead = tagOverhead
      breakdowns[tagName].laborMarkup = tagLaborMarkup
      breakdowns[tagName].salesTax = tagSalesTax
      breakdowns[tagName].totalWithOverheadAndTax = tagTotal + tagOverhead + tagLaborMarkup + tagSalesTax
    })

    return breakdowns
  }, [plumbingItems, overheadMarkupPercentage, laborMarkupPercentage, salesTaxPercentage])

  const InputWithLabel = ({ label, id, value, onChange, averageValue, onAverageClick }) => (
    <div className="flex flex-col mb-4 space-y-1">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-right">{label}</Label>
        <Input
          id={id}
          type="number"
          value={value}
          onChange={onChange}
          className="w-20 ml-2"
        />
      </div>
      <span 
        className="text-xs cursor-pointer text-muted-foreground hover:underline"
        onClick={onAverageClick}
      >
        Average: {averageValue}%
      </span>
    </div>
  )

  return (
    <div className="container p-4 mx-auto space-y-8">
            <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Estimate Overview</h1>
        <Link href="/admin/build" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Line Items
          </Button>
        </Link>
      </div>
      
      <Card className="text-white bg-gradient-to-r from-blue-500 to-blue-600">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm opacity-75">Total Bid</p>
              <p className="text-3xl font-bold">{formatCurrency(totals.totalBid)}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Labor Markup</p>
              <p className="text-3xl font-bold">{formatCurrency(totals.laborMarkup)}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Material Markup</p>
              <p className="text-3xl font-bold">{formatCurrency(data.materialMarkup)}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Total Profit/OH</p>
              <p className="text-3xl font-bold">{formatCurrency(totals.totalProfit)}</p>
            </div>
            <div className="md:col-span-2 lg:col-span-4">
              <p className="text-sm opacity-75">Profit Margin</p>
              <p className="text-3xl font-bold">{formatPercentage(totals.profitMargin)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="tags">Tag Breakdown</TabsTrigger>
          <TabsTrigger value="preview">PDF Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Editable Fields</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InputWithLabel
                  label="Overhead Markup (%)"
                  id="overheadMarkupPercentage"
                  value={overheadMarkupPercentage}
                  onChange={(e) => setOverheadMarkupPercentage(parseFloat(e.target.value) || 0)}
                  averageValue={averagePercentages.overheadMarkup}
                  onAverageClick={() => setOverheadMarkupPercentage(averagePercentages.overheadMarkup)}
                />
                <InputWithLabel
                  label="Sales Tax (%)"
                  id="salesTaxPercentage"
                  value={salesTaxPercentage}
                  onChange={(e) => setSalesTaxPercentage(parseFloat(e.target.value) || 0)}
                  averageValue={averagePercentages.salesTax}
                  onAverageClick={() => setSalesTaxPercentage(averagePercentages.salesTax)}
                />
                <InputWithLabel
                  label="Labor Markup (%)"
                  id="laborMarkupPercentage"
                  value={laborMarkupPercentage}
                  onChange={(e) => setLaborMarkupPercentage(parseFloat(e.target.value) || 0)}
                  averageValue={averagePercentages.laborMarkup}
                  onAverageClick={() => setLaborMarkupPercentage(averagePercentages.laborMarkup)}
                />
                <div className="flex items-center justify-between">
                  <Label htmlFor="directLabor">Direct Labor ($)</Label>
                  <Input
                    id="directLabor"
                    type="number"
                    value={data.directLabor}
                    onChange={(e) => updateField('directLabor', e.target.value)}
                    className="w-32 ml-2"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="materialCost">Material Cost ($)</Label>
                  <Input
                    id="materialCost"
                    type="number"
                    value={data.materialCost}
                    onChange={(e) => updateField('materialCost', e.target.value)}
                    className="w-32 ml-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bid Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Direct Labor</TableCell>
                      <TableCell className="text-right">{formatCurrency(data.directLabor)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Material Cost</TableCell>
                      <TableCell className="text-right">{formatCurrency(data.materialCost)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Permit</TableCell>
                      <TableCell className="text-right">{formatCurrency(data.permit)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Equipment Rental</TableCell>
                      <TableCell className="text-right">{formatCurrency(data.equipRental)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Labeling</TableCell>
                      
                      <TableCell className="text-right">{formatCurrency(data.labeling)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Overhead Markup</TableCell>
                      <TableCell className="text-right">{formatCurrency(totals.overheadMarkup)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Labor Markup</TableCell>
                      <TableCell className="text-right">{formatCurrency(totals.laborMarkup)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sales Tax</TableCell>
                      <TableCell className="text-right">{formatCurrency(totals.tax)}</TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell>Total Bid</TableCell>
                      <TableCell className="text-right">{formatCurrency(totals.totalBid)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(calculateTagBreakdowns).map(([tagName, breakdown]) => (
              <Card key={tagName} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    {tagName}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTagForBreakdown(tagName)}
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(breakdown.totalWithOverheadAndTax)}</div>
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
                    <div className="flex justify-between text-sm">
                      <span>Overhead:</span>
                      <span>{formatCurrency(breakdown.overhead)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Labor Markup:</span>
                      <span>{formatCurrency(breakdown.laborMarkup)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sales Tax:</span>
                      <span>{formatCurrency(breakdown.salesTax)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <PdfOverview />
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedTagForBreakdown} onOpenChange={() => setSelectedTagForBreakdown(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedTagForBreakdown} Breakdown</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
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
                  calculateTagBreakdowns[selectedTagForBreakdown].items.map((item, index) => (
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
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}