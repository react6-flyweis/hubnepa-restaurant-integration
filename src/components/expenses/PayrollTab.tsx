import { Download, EllipsisVertical } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { extractErrorMessage } from "@/lib/error-handler"
import { cn } from "@/lib/utils"
import { usePayrollQuery } from "@/hooks/usePayrollQuery"

import type {
  ExpenseRecord,
  ExpenseStatus,
  ExpenseRecordType,
} from "@/types/expenses"

interface PayrollTabProps {
  searchQuery?: string
  onViewInvoice: (record: ExpenseRecord) => void
}

const statusColorMap: Record<ExpenseStatus, string> = {
  Paid: "border-transparent bg-emerald-50 text-emerald-700",
  Pending: "border-transparent bg-amber-50 text-amber-700",
  Scheduled: "border-transparent bg-slate-100 text-slate-600",
  "Due Soon": "border-transparent bg-red-50 text-red-700",
}

const avatarColorMap: Record<ExpenseRecordType, string> = {
  payroll: "bg-slate-100 text-slate-700",
  maintenance: "bg-orange-50 text-orange-600",
  //   summary: "bg-blue-50 text-blue-600",
}

export function PayrollTab({
  searchQuery = "",
  onViewInvoice,
}: PayrollTabProps) {
  const { data, isLoading, error } = usePayrollQuery()
  const errorMessage = error
    ? extractErrorMessage(error, "Unable to load payroll records.")
    : null

  const payrollRecords =
    data?.data.map((record) => ({
      id: record._id,
      type: "payroll" as const,
      name: record.staff.fullName,
      subtitle: "Payroll",
      detail: record.staff.role,
      date: record.createdAt,
      month: record.month,
      amount: record.totalPay || record.baseSalary || 0,
      status: record.status as ExpenseStatus,
      actionLabel: "Payslip",
    })) ?? []

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const visibleRecords = payrollRecords.filter((record) => {
    return (
      normalizedQuery.length === 0 ||
      [record.name, record.subtitle, record.detail, record.month, record.status]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    )
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-900">
            Payroll Management
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg border-slate-200 bg-white px-3 text-slate-600 hover:bg-slate-50"
          >
            <Download className="size-4" />
            <span className="ml-2">Payroll Summary</span>
          </Button>
        </div>
        <Card className="mt-4 p-0">
          <CardContent className="px-0">
            <div className="space-y-3 p-6">
              <Skeleton className="h-4 w-1/3" />
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          </CardContent>
        </Card>
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
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-slate-900">
          Payroll Management
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-lg border-slate-200 bg-white px-3 text-slate-600 hover:bg-slate-50"
        >
          <Download className="size-4" />
          <span className="ml-2">Payroll Summary</span>
        </Button>
      </div>
      <Card className="mt-4 p-0">
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 bg-slate-50/70 hover:bg-slate-50/70">
                <TableHead className="px-6 py-4 text-xs font-medium text-slate-500 uppercase">
                  Employee
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-medium text-slate-500 uppercase">
                  Role
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-medium text-slate-500 uppercase">
                  Month
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-medium text-slate-500 uppercase">
                  Amount
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-medium text-slate-500 uppercase">
                  Status
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-medium text-slate-500 uppercase">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRecords.map((record) => (
                <TableRow key={record.id} className="border-slate-100">
                  <TableCell className="px-6 py-4 align-top whitespace-normal">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10" size="lg">
                        <AvatarFallback
                          className={cn(
                            "text-sm font-semibold",
                            avatarColorMap[record.type]
                          )}
                        >
                          {getInitials(record.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="text-base font-semibold text-slate-900">
                          {record.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {record.subtitle}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[15px] whitespace-normal text-slate-600">
                    {record.detail}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[15px] whitespace-normal text-slate-600">
                    {record.month}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-lg font-semibold text-slate-900">
                    {formatCurrency(record.amount)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <ExpenseStatusBadge status={record.status} />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="size-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                            aria-label={`Open actions for ${record.name}`}
                          >
                            <EllipsisVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => onViewInvoice(record)}
                          >
                            View Payslip
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              console.log("edit salary", record.id)
                            }
                          >
                            Edit Salary
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {visibleRecords.length === 0 ? (
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableCell
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No payroll records match the current filters.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

function ExpenseStatusBadge({ status }: { status: ExpenseStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-medium",
        statusColorMap[status]
      )}
    >
      {status}
    </Badge>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value)
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}
