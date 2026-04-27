import { Plus, RefreshCcw } from "lucide-react"

import { AddBeverageDialog } from "@/components/AddBeverageDialog"
import { StockAdjustmentDialog, type InventoryItem } from "@/components/StockAdjustmentDialog"
import { InventoryTable } from "@/components/inventory/InventoryTable"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useBeveragesQuery } from "@/hooks/useBeveragesQuery"

interface BeverageTabContentProps {
  isAddOpen: boolean
  onAddOpenChange: (open: boolean) => void
  isAdjustmentOpen: boolean
  onAdjustmentOpenChange: (open: boolean) => void
}

export function BeverageTabContent({
  isAddOpen,
  onAddOpenChange,
  isAdjustmentOpen,
  onAdjustmentOpenChange,
}: BeverageTabContentProps) {
  const beveragesQuery = useBeveragesQuery()

  const beverageItems: InventoryItem[] = (beveragesQuery.data?.data ?? []).map(
    (item) => ({
      name: item.name,
      category: item.category,
      currentStock: item.currentStock,
      minThreshold: item.minThreshold,
      unitType: item.unitType,
      supplier: "",
      status: item.status,
    })
  )

  return (
    <>
      <StockAdjustmentDialog
        open={isAdjustmentOpen}
        onClose={() => onAdjustmentOpenChange(false)}
        items={beverageItems}
        itemLabel="Beverage"
        onApply={(values) => {
          console.log("adjustment", values)
        }}
      />

      <AddBeverageDialog
        open={isAddOpen}
        onClose={() => onAddOpenChange(false)}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <p className="text-sm text-slate-500">Total: {beverageItems.length} items</p>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            variant="outline"
            size="lg"
            className="h-9 rounded-lg border-slate-200 bg-white px-3 text-slate-600 hover:bg-slate-50"
            onClick={() => onAdjustmentOpenChange(true)}
          >
            <RefreshCcw className="size-4" />
            Stock Adjustment
          </Button>
          <Button
            size="lg"
            className="h-9 rounded-lg px-3"
            onClick={() => onAddOpenChange(true)}
          >
            <Plus className="size-4" />
            Add Beverage
          </Button>
        </div>
      </div>

      <CardContent className="px-0 pb-4 sm:px-2">
        {beveragesQuery.isLoading ? (
          <Table className="min-w-245">
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent">
                {[
                  "Beverage Name",
                  "Category",
                  "Current Stock",
                  "Min Threshold",
                  "Unit Type",
                  "Supplier",
                  "Status",
                  "Action",
                ].map((heading) => (
                  <TableHead
                    key={heading}
                    className="h-auto px-6 py-4 text-xs font-medium whitespace-normal text-slate-500"
                  >
                    {heading}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`beverage-skeleton-${index}`} className="border-slate-100">
                  <TableCell className="px-6 py-4">
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Skeleton className="h-4 w-14" />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Skeleton className="h-4 w-14" />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : beveragesQuery.isError ? (
          <p className="px-6 py-8 text-sm text-red-600">
            Failed to load beverages. Please try again.
          </p>
        ) : (
          <InventoryTable items={beverageItems} firstColumnLabel="Beverage" />
        )}
      </CardContent>
    </>
  )
}
