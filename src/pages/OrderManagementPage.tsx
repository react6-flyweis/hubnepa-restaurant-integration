import { useState } from "react"
import { Filter } from "lucide-react"
import type { OrderColumnsState } from "@/components/order/orderTypes"
import { createInitialColumnsState } from "@/components/order/orderUtils"
import { LiveOrdersTab } from "@/components/order/LiveOrdersTab"
import { OrderHistoryTab } from "@/components/order/OrderHistoryTab"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { cn } from "@/lib/utils"

export default function OrderManagementPage() {
  const [activeTab, setActiveTab] = useState<"live" | "history">("live")
  const [columns, setColumns] = useState<OrderColumnsState>(() =>
    createInitialColumnsState()
  )

  return (
    <div className="p-6">
      <PageHeader
        title="Order Management"
        description="Track and manage your restaurant orders in real-time."
        right={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              className="h-10 border-slate-200 bg-white text-slate-600"
            >
              <Filter className="size-4" />
              Filter
            </Button>
            <Button
              size="lg"
              className="h-10 rounded-md bg-[#059669] text-white hover:bg-[#047857]"
            >
              Accept All New
            </Button>
          </div>
        }
      />

      <div className="mt-5 inline-flex rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            activeTab === "live"
              ? "bg-white text-slate-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
          onClick={() => setActiveTab("live")}
        >
          Live Orders
        </button>
        <button
          type="button"
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            activeTab === "history"
              ? "bg-white text-slate-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
          onClick={() => setActiveTab("history")}
        >
          Order History
        </button>
      </div>

      {activeTab === "live" ? (
        <LiveOrdersTab columns={columns} setColumns={setColumns} />
      ) : (
        <OrderHistoryTab />
      )}
    </div>
  )
}
