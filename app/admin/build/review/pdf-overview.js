'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Printer, Settings } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import Image from 'next/image';

export default function ImprovedEstimatePreview() {
  const [estimateData, setEstimateData] = useState({
    jobName: "Trinity Central Flats",
    totalPrice: 6897375.00,
    planDate: "8/30/2024",
    unitBreakdown: [
      { type: "1B1.0 Units", quantity: 42 },
      { type: "1B1.1 Units", quantity: 71 },
      { type: "2B2.0 Units", quantity: 8 },
      { type: "2B2.1 Units", quantity: 17 },
      { type: "2B2.2 Units", quantity: 8 },
      { type: "2B2.3 Units", quantity: 8 },
      { type: "2B2.4 Units", quantity: 8 },
      { type: "3B1.0 Units", quantity: 9 },
      { type: "EFF1.0 Units", quantity: 32 },
      { type: "S1.0 Units", quantity: 16 },
      { type: "RD Roof Drains", quantity: 2 },
      { type: "OD Overflow Drains", quantity: 2 },
      { type: "AD Area Drains", quantity: 2 },
      { type: "RD-1 Roof Drains", quantity: 12 },
      { type: "BP-1 Booster Pump", quantity: 1 },
      { type: "ESP-1 Elevator Sump Pump", quantity: 1 },
      { type: "1500 Gallon Grease Traps", quantity: 2 },
    ],
    includedItems: [
      "Plumbing Waste and Water Lines to 5ft Outside Building",
      "Domestic Water, Copper Type L With Insulation Risers",
      "Domestic Water in Units, PEX",
      "Sanitary Waste and Vent Piping Above & Below Grade Is PVC DWV Piping",
      "Gas Piping Is Black Steel",
      "Plumbing Fixture and Equipment Carriers",
      "Addendum 1 & 2"
    ],
    exclusions: [
      "Cutting or Patching of any type; asphalt, concrete, walls, etc.",
      "Dumpsters or Fees for concrete disposal",
      "Holes thru Metromont Deck",
      "Bond (Add 3%)"
    ],
    estimatorName: "Charlie Southerland",
    estimatorPhone: "404.597.0216"
  })

  const [pdfOptions, setPdfOptions] = useState({
    showLogo: true,
    showDisclaimer: true,
  })

  return (
    <div className="container p-4 mx-auto space-y-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Estimate Preview</h2>
        <div className="space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <h4 className="font-medium leading-none">PDF Options</h4>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-logo">Show Logo</Label>
                    <Switch
                      id="show-logo"
                      checked={pdfOptions.showLogo}
                      onCheckedChange={(checked) => setPdfOptions(prev => ({ ...prev, showLogo: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-disclaimer">Show Disclaimer</Label>
                    <Switch
                      id="show-disclaimer"
                      checked={pdfOptions.showDisclaimer}
                      onCheckedChange={(checked) => setPdfOptions(prev => ({ ...prev, showDisclaimer: checked }))}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>
      <div className="p-8 bg-white border shadow-inner">
        {pdfOptions.showLogo && (
          <div className="mb-6">
            <Image src="https://placehold.co/200x60" alt="Company Logo" width={200} height={60} className="mx-auto" />
          </div>
        )}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="jobName">JOB:</Label>
              <Input
                id="jobName"
                value={estimateData.jobName}
                onChange={(e) => setEstimateData(prev => ({ ...prev, jobName: e.target.value }))}
                className="font-bold"
              />
            </div>
            <div className="text-right">
              <Label htmlFor="totalPrice">Plumbing</Label>
              <Input
                id="totalPrice"
                value={estimateData.totalPrice}
                onChange={(e) => setEstimateData(prev => ({ ...prev, totalPrice: parseFloat(e.target.value) || 0 }))}
                className="font-bold text-right"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="planDate">PLANS:</Label>
            <Input
              id="planDate"
              value={estimateData.planDate}
              onChange={(e) => setEstimateData(prev => ({ ...prev, planDate: e.target.value }))}
            />
          </div>
          <div>
            <Label>Includes:</Label>
            <div className="grid grid-cols-2 gap-2">
              {estimateData.unitBreakdown.map((unit, index) => (
                <div key={index} className="flex justify-between">
                  <Input
                    value={unit.quantity}
                    onChange={(e) => {
                      const newUnitBreakdown = [...estimateData.unitBreakdown]
                      newUnitBreakdown[index].quantity = parseInt(e.target.value) || 0
                      setEstimateData(prev => ({ ...prev, unitBreakdown: newUnitBreakdown }))
                    }}
                    className="w-16 mr-2"
                  />
                  <Input
                    value={unit.type}
                    onChange={(e) => {
                      const newUnitBreakdown = [...estimateData.unitBreakdown]
                      newUnitBreakdown[index].type = e.target.value
                      setEstimateData(prev => ({ ...prev, unitBreakdown: newUnitBreakdown }))
                    }}
                    className="flex-grow"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label>Included Items:</Label>
            <Textarea
              value={estimateData.includedItems.join('\n')}
              onChange={(e) => setEstimateData(prev => ({ ...prev, includedItems: e.target.value.split('\n') }))}
              rows={7}
            />
          </div>
          <div>
            <Label>Exclusions:</Label>
            <Textarea
              value={estimateData.exclusions.join('\n')}
              onChange={(e) => setEstimateData(prev => ({ ...prev, exclusions: e.target.value.split('\n') }))}
              rows={4}
            />
          </div>
          <div>
            <p>Respectfully,</p>
            <Input
              value={estimateData.estimatorName}
              onChange={(e) => setEstimateData(prev => ({ ...prev, estimatorName: e.target.value }))}
              className="mt-2 font-bold"
            />
            <Input
              value={estimateData.estimatorPhone}
              onChange={(e) => setEstimateData(prev => ({ ...prev, estimatorPhone: e.target.value }))}
              className="mt-2"
            />
          </div>
          <div className="text-sm">
            <p>***Quote Valid for 30 Days for Labor***</p>
            <p>***Quote Valid for 15 Days for Materials***</p>
            <p>(Due to material price volatility)</p>
          </div>
          {pdfOptions.showDisclaimer && (
            <div className="mt-4 text-xs">
              <p>Lanier Plumbing Systems, LLC shall not be held liable for any impacts, delays, labor overruns, material overruns and/or cost overruns related to its Work stemming from the current flu epidemic, and/or COVID-19 (Coronavirus epidemic) as defined by the United States Centers for Disease Control and Prevention. Lanier Plumbing Systems, LLC shall further be entitled to a change order for any and all time and costs associated with said epidemic(s).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}