import { useEffect, useMemo, useState } from "react"
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { Skeleton } from "@/components/ui/skeleton"

import type { OrderColumnsState, OrderItem } from "./orderTypes"
import {
  isOrderStatus,
  findContainerByOrderId,
  findOrderById,
} from "./orderUtils"
import { orderColumns, orderStatuses, actionLabelMap } from "./orderConstants"
import { OrderColumnSection } from "./OrderColumnSection"
import { OrderCard } from "./OrderCard"
import { useLiveOrdersQuery } from "@/hooks/useLiveOrdersQuery"
import type { LiveOrderApiItem } from "@/lib/live-orders-api"

interface LiveOrdersTabProps {
  columns: OrderColumnsState
  setColumns: React.Dispatch<React.SetStateAction<OrderColumnsState>>
}

export function LiveOrdersTab({ columns, setColumns }: LiveOrdersTabProps) {
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null)
  const { data, isLoading } = useLiveOrdersQuery()

  useEffect(() => {
    if (!data?.orders?.length) {
      return
    }

    setColumns((previousColumns) => {
      const nextColumns = {
        ...previousColumns,
        new: [...previousColumns.new],
        cooking: [...previousColumns.cooking],
        ready: [...previousColumns.ready],
      }

      const existingIds = new Set(
        orderStatuses.flatMap((status) => nextColumns[status].map((order) => order.id))
      )

      for (const apiOrder of data.orders) {
        const normalized = normalizeApiOrder(apiOrder)
        if (!normalized || existingIds.has(normalized.id)) {
          continue
        }

        const status = resolveOrderStatus(apiOrder.status)
        normalized.actionLabel = actionLabelMap[status]
        nextColumns[status].push(normalized)
        existingIds.add(normalized.id)
      }

      return nextColumns
    })
  }, [data, setColumns])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const activeOrder = useMemo(() => {
    if (!activeOrderId) {
      return null
    }

    return findOrderById(columns, activeOrderId)
  }, [activeOrderId, columns])

  function handleDragStart(event: DragStartEvent) {
    setActiveOrderId(String(event.active.id))
  }

  function handleDragOver(event: DragOverEvent) {
    if (!event.over) {
      return
    }

    const activeId = String(event.active.id)
    const overId = String(event.over.id)

    setColumns((previousColumns) => {
      const activeContainer = findContainerByOrderId(previousColumns, activeId)
      const overContainer = isOrderStatus(overId)
        ? overId
        : findContainerByOrderId(previousColumns, overId)

      if (
        !activeContainer ||
        !overContainer ||
        activeContainer === overContainer
      ) {
        return previousColumns
      }

      const activeItems = previousColumns[activeContainer]
      const overItems = previousColumns[overContainer]
      const activeIndex = activeItems.findIndex(
        (order) => order.id === activeId
      )

      if (activeIndex < 0) {
        return previousColumns
      }

      const movingOrder = activeItems[activeIndex]
      const updatedOrder: OrderItem = {
        ...movingOrder,
        actionLabel: actionLabelMap[overContainer],
      }

      const overIndex = isOrderStatus(overId)
        ? overItems.length
        : overItems.findIndex((order) => order.id === overId)
      const insertAt = overIndex >= 0 ? overIndex : overItems.length

      const nextActiveItems = activeItems.filter(
        (order) => order.id !== activeId
      )
      const nextOverItems = [...overItems]
      nextOverItems.splice(insertAt, 0, updatedOrder)

      return {
        ...previousColumns,
        [activeContainer]: nextActiveItems,
        [overContainer]: nextOverItems,
      }
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveOrderId(null)

    if (!event.over) {
      return
    }

    const activeId = String(event.active.id)
    const overId = String(event.over.id)

    setColumns((previousColumns) => {
      const activeContainer = findContainerByOrderId(previousColumns, activeId)
      const overContainer = isOrderStatus(overId)
        ? overId
        : findContainerByOrderId(previousColumns, overId)

      if (
        !activeContainer ||
        !overContainer ||
        activeContainer !== overContainer
      ) {
        return previousColumns
      }

      const items = previousColumns[activeContainer]
      const activeIndex = items.findIndex((order) => order.id === activeId)
      const overIndex = isOrderStatus(overId)
        ? items.length - 1
        : items.findIndex((order) => order.id === overId)

      if (
        activeIndex < 0 ||
        overIndex < 0 ||
        activeIndex === overIndex ||
        overIndex >= items.length
      ) {
        return previousColumns
      }

      return {
        ...previousColumns,
        [activeContainer]: arrayMove(items, activeIndex, overIndex),
      }
    })
  }

  function handleDragCancel() {
    setActiveOrderId(null)
  }

  if (isLoading) {
    return <LiveOrdersSkeleton />
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {orderColumns.map((column) => (
          <OrderColumnSection
            key={column.key}
            column={column}
            orders={columns[column.key]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeOrderId && activeOrder ? (
          <OrderCard
            order={activeOrder}
            status={
              findContainerByOrderId(columns, activeOrderId) ?? orderStatuses[0]
            }
            isOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function resolveOrderStatus(status?: string): keyof OrderColumnsState {
  if (!status) {
    return "new"
  }

  const normalized = status.toLowerCase()
  if (normalized === "new" || normalized === "pending") {
    return "new"
  }

  if (normalized === "cooking" || normalized === "preparing" || normalized === "in-progress") {
    return "cooking"
  }

  if (normalized === "ready" || normalized === "completed") {
    return "ready"
  }

  return "new"
}

function normalizeFulfillmentType(type?: string): OrderItem["fulfillmentType"] {
  if (!type) {
    return "Delivery"
  }

  const normalized = type.toLowerCase()
  if (normalized === "pickup") {
    return "Pickup"
  }
  if (normalized === "dine-in" || normalized === "dinein") {
    return "Dine-in"
  }

  return "Delivery"
}

function normalizeApiOrder(order: LiveOrderApiItem): OrderItem | null {
  const id = order.orderId ?? order.id
  if (!id) {
    return null
  }

  const items = Array.isArray(order.items)
    ? order.items
    : order.items
      ? [order.items]
      : ["No items listed"]
  const total = order.amount ?? order.total
  const amount =
    typeof total === "number" ? `$${total.toFixed(2)}` : total ? String(total) : "$0.00"

  return {
    id: String(id),
    age: order.age ?? order.timeAgo ?? "Just now",
    fulfillmentType: normalizeFulfillmentType(order.fulfillmentType ?? order.orderType),
    customerName: order.customerName ?? order.customer ?? "Guest",
    items,
    amount,
    actionLabel: "Accept Order",
  }
}

function LiveOrdersSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
      {orderColumns.map((column) => (
        <div key={column.key} className="rounded-xl border p-3">
          <div className="mb-3 flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
