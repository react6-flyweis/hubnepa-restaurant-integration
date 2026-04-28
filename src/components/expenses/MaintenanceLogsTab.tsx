import { CircleCheck, Clock3, type LucideIcon, Wrench } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { extractErrorMessage } from "@/lib/error-handler"
import { cn } from "@/lib/utils"
import { useMaintenanceLogsQuery } from "@/hooks/useMaintenanceLogsQuery"
import { useResolveMaintenanceIssueMutation } from "@/hooks/useResolveMaintenanceIssueMutation"

type MaintenancePriority = "High" | "Medium" | "Low"
type MaintenanceStatus = "Resolved" | "Scheduled" | "In Progress"

// interface MaintenanceLog {
//   id: string
//   title: string
//   summary: string
//   vendor: string
//   cost: number
//   dateReported: string
//   priority: MaintenancePriority
//   status: MaintenanceStatus
// }

interface MaintenanceLogsTabProps {
  searchQuery?: string
}

interface StatusMeta {
  icon: LucideIcon | null
  textClassName: string
  iconClassName: string
}

const priorityClassMap: Record<MaintenancePriority, string> = {
  High: "border-transparent bg-red-50 text-red-600",
  Medium: "border-transparent bg-amber-50 text-amber-600",
  Low: "border-transparent bg-blue-50 text-blue-600",
}

const statusMetaMap: Record<string, StatusMeta> = {
  Resolved: {
    icon: CircleCheck,
    textClassName: "text-emerald-600",
    iconClassName: "text-emerald-500",
  },
  Scheduled: {
    icon: null,
    textClassName: "text-slate-600",
    iconClassName: "text-slate-500",
  },
  "In Progress": {
    icon: Clock3,
    textClassName: "text-blue-600",
    iconClassName: "text-blue-500",
  },
}

function normalizePriority(value: string): MaintenancePriority {
  const normalized = value.toLowerCase()

  if (normalized.includes("high")) {
    return "High"
  }

  if (normalized.includes("medium")) {
    return "Medium"
  }

  if (normalized.includes("low")) {
    return "Low"
  }

  return "Medium"
}

export function MaintenanceLogsTab({
  searchQuery = "",
}: MaintenanceLogsTabProps) {
  const { data, isLoading, error } = useMaintenanceLogsQuery()
  const resolveMaintenanceIssueMutation = useResolveMaintenanceIssueMutation()
  const errorMessage = error
    ? extractErrorMessage(error, "Unable to load maintenance logs.")
    : null

  const maintenanceLogs =
    data?.data.map((item) => ({
      id: item._id,
      title: item.itemName,
      summary: item.issue,
      vendor: item.restaurant,
      cost: item.cost,
      dateReported: item.dateReported,
      priority: normalizePriority(item.priority),
      status: item.status as MaintenanceStatus,
    })) ?? []

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const visibleLogs = maintenanceLogs.filter((log) => {
    return (
      normalizedQuery.length === 0 ||
      [
        log.title,
        log.summary,
        log.vendor,
        log.priority,
        log.status,
        formatDate(log.dateReported),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    )
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            Maintenance & Repairs
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {[1, 2].map((item) => (
            <Card key={item} className="border-slate-200">
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <Card className="mt-4 border-slate-200 shadow-none">
        <CardContent className="py-12 text-center text-sm text-slate-500">
          {errorMessage}
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          Maintenance & Repairs
        </h2>

        <Button
          size="lg"
          className="rounded-lg bg-slate-900 px-3 text-white hover:bg-slate-800"
        >
          <Wrench className="size-3.5" />
          Report Issue
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {visibleLogs.map((log) => {
          const statusMeta = statusMetaMap[log.status] ?? {
            icon: null,
            textClassName: "text-slate-600",
            iconClassName: "text-slate-500",
          }
          const StatusIcon = statusMeta.icon
          const isResolved = log.status === "Resolved"

          return (
            <Card key={log.id} className="border-slate-200">
              <CardContent className="">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-slate-900">
                      {log.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">{log.summary}</p>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full px-2 py-1 text-[11px] font-medium",
                      priorityClassMap[log.priority]
                    )}
                  >
                    {log.priority} Priority
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                  <MaintenanceMetaItem label="Vendor" value={log.vendor} />
                  <MaintenanceMetaItem
                    label="Cost"
                    value={formatCurrency(log.cost)}
                    valueClassName="font-medium text-slate-900"
                  />
                  <MaintenanceMetaItem
                    label="Date Reported"
                    value={formatDate(log.dateReported)}
                    valueClassName="font-medium text-slate-900"
                  />
                  <div>
                    <p className="text-xs text-slate-500">Status</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      {StatusIcon ? (
                        <StatusIcon
                          className={cn("size-3.5", statusMeta.iconClassName)}
                        />
                      ) : null}
                      <p
                        className={cn(
                          "text-sm font-medium",
                          statusMeta.textClassName
                        )}
                      >
                        {log.status}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 rounded-lg border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100",
                      isResolved ? "w-full" : "flex-1"
                    )}
                  >
                    View Details
                  </Button>

                  {!isResolved ? (
                    <Button
                      size="sm"
                      className="h-8 flex-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                      onClick={() =>
                        resolveMaintenanceIssueMutation.mutate(log.id)
                      }
                      disabled={
                        resolveMaintenanceIssueMutation.status === "pending"
                      }
                    >
                      Mark Resolved
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {visibleLogs.length === 0 ? (
        <Card className="mt-4 border-slate-200 shadow-none">
          <CardContent className="py-12 text-center text-sm text-slate-500">
            No maintenance logs match the current filters.
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function MaintenanceMetaItem({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={cn("mt-1 text-sm text-slate-700", valueClassName)}>
        {value}
      </p>
    </div>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value)
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}
