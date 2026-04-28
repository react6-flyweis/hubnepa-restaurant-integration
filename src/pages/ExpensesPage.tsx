import { useState } from "react"
import {
  Download,
  Plus,
  TrendingDown,
  type LucideIcon,
  Users,
  Wrench,
  Search,
} from "lucide-react"

import { AddExpenseDialog } from "@/components/AddExpenseDialog"
import type { NewExpense } from "@/components/AddExpenseDialog"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { ViewInvoiceDialog } from "@/components/ViewInvoiceDialog"
import { cn, formatCurrency } from "@/lib/utils"

import { AllTransactionsTab } from "@/components/expenses/AllTransactionsTab"
import { MaintenanceLogsTab } from "@/components/expenses/MaintenanceLogsTab"
import { PayrollTab } from "@/components/expenses/PayrollTab"

import type {
  ExpenseView,
  ExpenseStatKey,
  ExpenseRecord,
} from "@/types/expenses"
import { Input } from "@/components/ui/input"

interface ExpenseStat {
  key: ExpenseStatKey
  title: string
  value: string
  badgeLabel: string
}

// initial static data; will be used to initialize state so new records can be added
const initialExpenseRecords: ExpenseRecord[] = [
  {
    id: "pay-001",
    type: "payroll",
    name: "John Doe",
    subtitle: "Kitchen Team",
    detail: "Head Chef",
    date: "2026-01-01",
    month: "January 2026",
    amount: 3200,
    status: "Paid",
    actionLabel: "Payslip",
  },
  {
    id: "pay-002",
    type: "payroll",
    name: "Sarah Smith",
    subtitle: "Operations",
    detail: "Restaurant Manager",
    date: "2026-01-01",
    month: "January 2026",
    amount: 2800,
    status: "Paid",
    actionLabel: "Payslip",
  },
  {
    id: "pay-003",
    type: "payroll",
    name: "Mike Johnson",
    subtitle: "Kitchen Team",
    detail: "Sous Chef",
    date: "2026-01-01",
    month: "January 2026",
    amount: 2100,
    status: "Pending",
    actionLabel: "Payslip",
  },
  {
    id: "pay-004",
    type: "payroll",
    name: "Emily Chen",
    subtitle: "Service Team",
    detail: "Waitstaff",
    date: "2026-01-01",
    month: "January 2026",
    amount: 1500,
    status: "Paid",
    actionLabel: "Payslip",
  },
  {
    id: "mnt-001",
    type: "maintenance",
    name: "Everest Cooling",
    subtitle: "Equipment vendor",
    detail: "HVAC Service",
    date: "2026-01-15",
    month: "January 2026",
    amount: 620.5,
    status: "Paid",
    actionLabel: "Invoice",
  },
  {
    id: "mnt-002",
    type: "maintenance",
    name: "KitchenCare Pro",
    subtitle: "Facility partner",
    detail: "Oven Repair",
    date: "2026-01-20",
    month: "January 2026",
    amount: 570.5,
    status: "Pending",
    actionLabel: "Invoice",
  },
  {
    id: "mnt-003",
    type: "maintenance",
    name: "Bright Supplies",
    subtitle: "Operations vendor",
    detail: "Cleaning Materials",
    date: "2026-01-10",
    month: "January 2026",
    amount: 425,
    status: "Scheduled",
    actionLabel: "Invoice",
  },
  {
    id: "mnt-004",
    type: "maintenance",
    name: "Metro Electrical",
    subtitle: "Service partner",
    detail: "Lighting Maintenance",
    date: "2026-01-05",
    month: "January 2026",
    amount: 318.5,
    status: "Paid",
    actionLabel: "Invoice",
  },
  {
    id: "mnt-005",
    type: "maintenance",
    name: "City Utilities",
    subtitle: "Vendor",
    detail: "Electricity Bill",
    date: "2026-02-05",
    month: "February 2026",
    amount: 420,
    status: "Due Soon",
    actionLabel: "Invoice",
  },
]

const statMetaMap: Record<
  ExpenseStatKey,
  {
    icon: LucideIcon
    iconClassName: string
    wrapperClassName: string
    badgeClassName: string
  }
> = {
  total: {
    icon: TrendingDown,
    iconClassName: "text-red-500",
    wrapperClassName: "bg-red-50",
    badgeClassName: "bg-red-50 text-red-500",
  },
  payroll: {
    icon: Users,
    iconClassName: "text-blue-600",
    wrapperClassName: "bg-blue-50",
    badgeClassName: "bg-blue-50 text-blue-600",
  },
  maintenance: {
    icon: Wrench,
    iconClassName: "text-orange-500",
    wrapperClassName: "bg-orange-50",
    badgeClassName: "bg-orange-50 text-orange-500",
  },
}

export default function ExpensesPage() {
  const [activeView, setActiveView] = useState<ExpenseView>("all")
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<ExpenseRecord | null>(
    null
  )
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  // for the global filter input
  const [filterQuery, setFilterQuery] = useState<string>("")

  // stateful records so new expenses can be added
  const [records, setRecords] = useState<ExpenseRecord[]>(initialExpenseRecords)

  const payrollTotal = records
    .filter((record) => record.type === "payroll")
    .reduce((sum, record) => sum + record.amount, 0)
  const maintenanceTotal = records
    .filter((record) => record.type === "maintenance")
    .reduce((sum, record) => sum + record.amount, 0)

  const stats: ExpenseStat[] = [
    {
      key: "total",
      title: "Total Expenses (Jan)",
      value: formatCurrency(payrollTotal + maintenanceTotal),
      badgeLabel: "+4.5%",
    },
    {
      key: "payroll",
      title: "Staff Payroll",
      value: formatCurrency(payrollTotal),
      badgeLabel: "Fixed Cost",
    },
    {
      key: "maintenance",
      title: "Maintenance & Misc",
      value: formatCurrency(maintenanceTotal),
      badgeLabel: "Variable",
    },
  ]

  const expenseTabs: { key: ExpenseView; label: string }[] = [
    { key: "all", label: "All Transactions" },
    { key: "payroll", label: "Salaries & Payroll" },
    { key: "maintenance", label: "Maintenance Logs" },
  ]

  function handleAddExpense(values: NewExpense) {
    const dateObj = new Date(values.date)
    const formattedMonth = dateObj.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })

    const newRecord: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      type: values.type,
      name: values.title,
      subtitle: values.category,
      detail: values.notes ?? "",
      date: values.date,
      month: formattedMonth,
      amount: values.amount,
      status: values.status,
      actionLabel: values.type === "payroll" ? "Payslip" : "Invoice",
    }

    setRecords((prev) => [...prev, newRecord])
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Expenses & Finance"
        description="Track your spending, salaries, and operational costs."
        right={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              variant="outline"
              size="lg"
              className="h-10 rounded-lg border-slate-200 bg-white px-4 text-slate-600 hover:bg-slate-50"
            >
              <Download className="size-4" />
              Export Report
            </Button>
            <Button
              size="lg"
              className="h-10 rounded-lg bg-[#059669] px-4 text-white hover:bg-[#047857]"
              onClick={() => setAddDialogOpen(true)}
            >
              <Plus className="size-4" />
              Add Expense
            </Button>
          </div>
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <ExpenseStatCard key={stat.key} stat={stat} />
        ))}
      </div>

      {/* tabs for switching views */}
      <div className="my-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          {expenseTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveView(tab.key)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                activeView === tab.key
                  ? "bg-white text-slate-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter records..."
              className="h-10 rounded-lg border-slate-200 bg-white pl-9 text-slate-600 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* content area */}
      {activeView === "all" ? (
        <AllTransactionsTab
          records={records}
          searchQuery={filterQuery}
          onViewInvoice={(record) => {
            setSelectedRecord(record)
            setInvoiceDialogOpen(true)
          }}
        />
      ) : activeView === "payroll" ? (
        <PayrollTab
          searchQuery={filterQuery}
          onViewInvoice={(record) => {
            setSelectedRecord(record)
            setInvoiceDialogOpen(true)
          }}
        />
      ) : (
        <MaintenanceLogsTab searchQuery={filterQuery} />
      )}
      {/* add new expense dialog */}
      <AddExpenseDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAddExpense}
      />

      {/* invoice dialog */}
      <ViewInvoiceDialog
        open={invoiceDialogOpen}
        onClose={() => setInvoiceDialogOpen(false)}
        record={selectedRecord}
      />
    </div>
  )
}

function ExpenseStatCard({ stat }: { stat: ExpenseStat }) {
  const meta = statMetaMap[stat.key]
  const Icon = meta.icon

  return (
    <Card className="">
      <CardContent className="flex items-start justify-between gap-4 px-5">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl",
              meta.wrapperClassName
            )}
          >
            <Icon className={cn("size-5", meta.iconClassName)} />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">{stat.title}</p>
            <p className="mt-4 font-display text-[2rem] leading-none font-semibold text-slate-900">
              {stat.value}
            </p>
          </div>
        </div>

        <Badge
          className={cn(
            "rounded-full px-2.5 py-1 font-medium",
            meta.badgeClassName
          )}
        >
          {stat.badgeLabel}
        </Badge>
      </CardContent>
    </Card>
  )
}
