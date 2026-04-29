import { useMemo, useState } from "react"
import { Plus } from "lucide-react"

import { AddInventoryItemDialog } from "@/components/AddInventoryItemDialog"
import { AddCookedFoodDialog } from "@/components/AddCookedFoodDialog"
import type { InventoryItem as StockItem } from "@/components/StockAdjustmentDialog"
import { useKitchenItemsQuery } from "@/hooks/useKitchenItemsQuery"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent } from "@/components/ui/card"

// inventory helpers
import { InventoryStatCard } from "@/components/inventory/InventoryStatCard"
import { InventoryTabs } from "@/components/inventory/InventoryTabs"
import { KitchenTabs } from "@/components/inventory/KitchenTabs"
import { KitchenItemTabs } from "@/components/inventory/KitchenItemTabs"
import { InventoryTable } from "@/components/inventory/InventoryTable"
import { CookedFoodTable } from "@/components/inventory/CookedFoodTable"
import { BeverageTabContent } from "@/components/inventory/BeverageTabContent"
import type {
  CookedStatus,
  InventoryTab,
  KitchenSubTab,
  KitchenItemSubTab,
  CookedFood,
  InventoryStat,
} from "@/types/inventory"

// reuse the type exported by the dialog component to keep shapes in sync
// (StockItem has the identical fields used by this page)
type InventoryItem = StockItem

// sample data for the "cooked food" view
const initialCookedFoods: CookedFood[] = [
  {
    dishName: "Chicken Alfredo",
    preparedBy: "Chef Maria",
    preparedDate: "18/02/2026 05:34",
    expiryDate: "21/02/2026 05:34",
    remainingTime: "2d 13h",
    quantity: "5 Portions",
    status: "Fresh",
  },
  {
    dishName: "Vegetable Soup",
    preparedBy: "Chef John",
    preparedDate: "16/02/2026 02:34",
    expiryDate: "19/02/2026 02:34",
    remainingTime: "10h 59m",
    quantity: "3 Liters",
    status: "Expiring Soon",
  },
  {
    dishName: "Beef Stew",
    preparedBy: "Chef Sarah",
    preparedDate: "15/02/2026 14:34",
    expiryDate: "18/02/2026 14:34",
    remainingTime: "Expired",
    quantity: "2 Kg",
    status: "Expired",
  },
]

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<InventoryTab>("beverage")
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)

  // additional local state for the kitchen section
  const [activeKitchenTab, setActiveKitchenTab] =
    useState<KitchenSubTab>("cooked")
  const [activeKitchenItemTab, setActiveKitchenItemTab] =
    useState<KitchenItemSubTab>("raw")
  const [cookedFoods, setCookedFoods] =
    useState<CookedFood[]>(initialCookedFoods)

  const kitchenQuery = useKitchenItemsQuery(1, 20)
  const kitchenStats = kitchenQuery.data?.stats

  const inventoryStats: InventoryStat[] = [
    {
      key: "recipes",
      title: "Total Recipes",
      value: "48",
    },
    {
      key: "value",
      title: "Inventory Value",
      value: kitchenStats ? `$${kitchenStats.totalValue}` : "$12,450",
    },
    {
      key: "alerts",
      title: "Low Stock Alerts",
      value: kitchenStats ? `${kitchenStats.lowStock} Items` : "3 Items",
    },
  ]

  const kitchenApiItemsByType = useMemo(() => {
    const items: Record<KitchenItemSubTab, InventoryItem[]> = {
      raw: [],
      solid: [],
    }

    const fetchedItems = kitchenQuery.data?.data ?? []

    fetchedItems.forEach((item) => {
      const mappedItem: InventoryItem = {
        name: item.itemName,
        category: item.category,
        currentStock: item.currentStock,
        minThreshold: item.minThreshold,
        unitType: item.unitOfMeasure,
        supplier: "",
        status: item.status,
      }

      if (item.itemType?.toLowerCase() === "raw") {
        items.raw.push(mappedItem)
      } else if (item.itemType?.toLowerCase() === "solid") {
        items.solid.push(mappedItem)
      } else {
        items.raw.push(mappedItem)
      }
    })

    return items
  }, [kitchenQuery.data?.data])

  const kitchenItemsByType = kitchenApiItemsByType

  // determine which items are currently being displayed
  const activeItems =
    activeKitchenTab === "item" ? kitchenItemsByType[activeKitchenItemTab] : [] // cooked handled separately

  const activeCooked = activeTab === "kitchen" && activeKitchenTab === "cooked"

  const addActionLabel =
    activeTab === "beverage"
      ? "Add Beverage"
      : activeCooked
        ? "Add Cooked Food"
        : activeKitchenItemTab === "raw"
          ? "Add Raw Food Item"
          : "Add Solid Item"

  const firstColumnLabel =
    activeTab === "beverage"
      ? "Beverage"
      : activeCooked
        ? "Dish Name"
        : "Kitchen Item"

  return (
    <div className="p-6">
      <PageHeader
        title="Recipe & Inventory"
        description="Track stock levels, manage recipes, and calculate food costs."
        right={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {activeTab !== "kitchen" && (
              <Button
                variant="outline"
                size="lg"
                className="h-10 rounded-lg border-slate-200 bg-white px-4 text-slate-600 hover:bg-slate-50"
                onClick={() => setIsAdjustmentOpen(true)}
              >
                Stock Adjustment
              </Button>
            )}
            <Button
              size="lg"
              className="h-10 rounded-lg bg-[#059669] px-4 text-white hover:bg-[#047857]"
              onClick={() => setIsAddOpen(true)}
            >
              <Plus className="size-4" />
              Add item
            </Button>
          </div>
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {inventoryStats.map((stat) => (
          <InventoryStatCard key={stat.key} stat={stat} />
        ))}
      </div>

      <Card className="mt-6 rounded-2xl border-0 bg-white py-0 shadow-[0_0_0_1px_#E5E7EB]">
        {/* add new item or cooked food depending on the active view */}
        {activeCooked ? (
          <AddCookedFoodDialog
            open={isAddOpen}
            onClose={() => setIsAddOpen(false)}
            onSubmit={(values) => {
              // simple derived values for remaining time and status
              const now = new Date()
              const expiry = new Date(values.expiryDate)
              const diff = expiry.getTime() - now.getTime()
              let remainingTime: string
              let status: CookedStatus
              if (diff <= 0) {
                remainingTime = "Expired"
                status = "Expired"
              } else {
                const hrs = Math.floor(diff / (1000 * 60 * 60))
                if (diff < 24 * 60 * 60 * 1000) {
                  remainingTime = `${hrs}h`
                  status = "Expiring Soon"
                } else {
                  const days = Math.floor(hrs / 24)
                  const remH = hrs % 24
                  remainingTime = `${days}d ${remH}h`
                  status = "Fresh"
                }
              }

              const newCooked: CookedFood = {
                dishName: values.dishName,
                preparedBy: values.preparedBy,
                preparedDate: values.preparedDate,
                expiryDate: values.expiryDate,
                remainingTime,
                quantity: values.quantity,
                status,
              }

              setCookedFoods((prev) => [...prev, newCooked])
            }}
          />
        ) : (
          <AddInventoryItemDialog
            open={isAddOpen}
            onClose={() => setIsAddOpen(false)}
          />
        )}
        <InventoryTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* kitchen sub-tabs shown only when the kitchen tab is active */}
        {activeTab === "kitchen" && (
          <KitchenTabs
            activeTab={activeKitchenTab}
            onChange={setActiveKitchenTab}
          />
        )}

        {activeTab === "kitchen" && activeKitchenTab === "item" && (
          <div className="px-4 pt-4 sm:px-6">
            <KitchenItemTabs
              activeTab={activeKitchenItemTab}
              onChange={setActiveKitchenItemTab}
            />
          </div>
        )}

        {activeTab === "beverage" ? (
          <BeverageTabContent
            isAddOpen={isAddOpen}
            onAddOpenChange={setIsAddOpen}
            isAdjustmentOpen={isAdjustmentOpen}
            onAdjustmentOpenChange={setIsAdjustmentOpen}
          />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
              <p className="text-sm text-slate-500">
                Total:
                {activeCooked ? cookedFoods.length : activeItems.length} items
              </p>

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <Button
                  size="lg"
                  className="h-9 rounded-lg px-3"
                  onClick={() => setIsAddOpen(true)}
                >
                  <Plus className="size-4" />
                  {addActionLabel}
                </Button>
              </div>
            </div>

            <CardContent className="px-0 pb-4 sm:px-2">
              {activeCooked ? (
                <CookedFoodTable foods={cookedFoods} />
              ) : kitchenQuery.isLoading && activeTab === "kitchen" ? (
                <div className="px-6 py-8 text-sm text-slate-500">
                  Loading kitchen inventory...
                </div>
              ) : kitchenQuery.isError && activeTab === "kitchen" ? (
                <div className="px-6 py-8 text-sm text-red-600">
                  Failed to load kitchen items. Please refresh the page.
                </div>
              ) : (
                <InventoryTable
                  items={activeItems}
                  firstColumnLabel={firstColumnLabel}
                />
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
