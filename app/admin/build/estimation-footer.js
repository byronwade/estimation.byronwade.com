"use client";

import React, { forwardRef } from 'react';
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

const EstimationFooter = forwardRef(function EstimationFooter(props, ref) {
  const lineItemCount = props.lineItemCount || 0;
  const totalLaborCost = props.totalLaborCost || 0;
  const totalMaterialCost = props.totalMaterialCost || 0;

  const totalCost = totalLaborCost + totalMaterialCost;

  return (
    <div ref={ref} className="fixed bottom-0 left-0 right-0 flex items-center justify-between p-4 border-t bg-background">
      <div className="flex space-x-4">
        <div>
          <p className="text-sm font-medium">Line Items</p>
          <p className="text-lg font-bold">{lineItemCount}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Labor Cost</p>
          <p className="text-lg font-bold">${totalLaborCost.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Material Cost</p>
          <p className="text-lg font-bold">${totalMaterialCost.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Total Cost</p>
          <p className="text-lg font-bold">${totalCost.toFixed(2)}</p>
        </div>
      </div>
      <Link href="/admin/build/review" passHref>
        <Button className="flex items-center gap-2">
          Next
          <ChevronRight size={24} />
        </Button>
      </Link>
    </div>
  );
});

EstimationFooter.displayName = 'EstimationFooter';

export default EstimationFooter;