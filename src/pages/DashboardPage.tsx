import {
  StatsCard,
  type StatsCardProps,
} from "@/components/dashboard/StatsCard"
import { useMemo } from "react"
import { Calendar, CreditCard, DollarSign, Users, Wallet } from "lucide-react"

import { type DashboardData } from "@/lib/dashboard-api"
import { extractErrorMessage } from "@/lib/error-handler"
import { formatCurrency } from "@/lib/report-utils"
import { useDashboardQuery } from "@/hooks/useDashboardQuery"
import { PageHeader } from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MonthlyReportSection,
  type MonthlyReportCard,
} from "@/components/dashboard/MonthlyReportSection"
import {
  ExpenseBreakdownSection,
  type ExpenseItem,
} from "@/components/dashboard/ExpenseBreakdownSection"
import {
  RecentOrdersSection,
  type OrderRow,
} from "@/components/dashboard/RecentOrdersSection"
import {
  PopularItemsSection,
  type PopularItem,
} from "@/components/dashboard/PopularItemsSection"

const DEFAULT_DASHBOARD_DATA: DashboardData = {
  totalOrders: 0,
  monthRevenue: 0,
  pendingOrders: 0,
  recentOrders: [],
  popularItems: [],
  staffCount: 0,
  expenses: {
    total: 0,
    salary: 0,
  },
  rating: {
    average: 0,
    count: 0,
  },
}

function parseNumericValue(value: number | string | undefined) {
  if (typeof value === "number") {
    return value
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

function DashboardSkeleton() {
  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={`stats-skeleton-${index}`} className="h-40 w-full" />
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    </>
  )
}

export default function DashboardPage() {
  const { data: dashboardData, isLoading, error } = useDashboardQuery()
  const data = dashboardData ?? DEFAULT_DASHBOARD_DATA
  const errorMessage = error
    ? extractErrorMessage(error, "Failed to load dashboard.")
    : null
  const otherExpensesAmount = Math.max(data.expenses.total - data.expenses.salary, 0)

  const reportColorMap = {
    sales: "#10B981",
    expenses: "#3B82F6",
    maintenance: "#8B5CF6",
    salaries: "#F97316",
  } as const

  const stats = useMemo<StatsCardProps[]>(
    () => [
      {
        title: "Sales – This Month",
        value: formatCurrency(data.monthRevenue),
        change: `${data.totalOrders} total orders`,
        changeType: "positive",
        icon: <DollarSign className="h-5 w-5 text-green-500" />,
      footerText: "Updated after monthly report generation",
      },
      {
        title: "Expenses – This Month",
        value: formatCurrency(data.expenses.total),
        change: `${data.pendingOrders} pending orders`,
        changeType: "positive",
        icon: <Wallet className="h-5 w-5 text-blue-500" />,
      footerText: "Updated after monthly report generation",
      },
      {
        title: "Total Staff – This Month",
        value: data.staffCount,
        change: `${data.rating.average.toFixed(1)} rating (${data.rating.count})`,
        changeType: "positive",
        icon: <Users className="h-5 w-5 text-purple-500" />,
      footerText: "Updated after monthly report generation",
      },
      {
        title: "Salary – This Month",
        value: formatCurrency(data.expenses.salary),
        change: `${formatCurrency(otherExpensesAmount)} other expenses`,
        changeType: "positive",
        icon: <CreditCard className="h-5 w-5 text-yellow-500" />,
        footerText: "Updated after monthly report generation",
      },
    ],
    [data, otherExpensesAmount]
  )

  const monthlyReportCards: MonthlyReportCard[] = [
    {
      title: "Sales",
      total: formatCurrency(data.monthRevenue),
      key: "sales",
      totalClassName: "text-[#10B981]",
      type: "bar",
      yAxisWidth: 36,
      data: [
        { month: "Jan", value: 42000 },
        { month: "Feb", value: 38000 },
        { month: "Mar", value: 45000 },
        { month: "Apr", value: 48000 },
        { month: "May", value: 53000 },
        { month: "Jun", value: 44250 },
      ],
      yTicks: [0, 15000, 30000, 45000, 60000],
    },
    {
      title: "Expenses",
      total: formatCurrency(data.expenses.total),
      key: "expenses",
      totalClassName: "text-[#3B82F6]",
      type: "line",
      yAxisWidth: 36,
      data: [
        { month: "Jan", value: 27500 },
        { month: "Feb", value: 24500 },
        { month: "Mar", value: 30500 },
        { month: "Apr", value: 27500 },
        { month: "May", value: 29500 },
        { month: "Jun", value: 28150 },
      ],
      yTicks: [0, 7500, 15000, 22500, 30000],
    },
    {
      title: "Maintenance Cost",
      total: formatCurrency(otherExpensesAmount),
      key: "maintenance",
      totalClassName: "text-[#A855F7]",
      type: "bar",
      yAxisWidth: 32,
      data: [
        { month: "Jan", value: 3200 },
        { month: "Feb", value: 2800 },
        { month: "Mar", value: 4100 },
        { month: "Apr", value: 3500 },
        { month: "May", value: 2900 },
        { month: "Jun", value: 3400 },
      ],
      yTicks: [0, 1500, 3000, 4500, 6000],
    },
    {
      title: "Salaries",
      total: formatCurrency(data.expenses.salary),
      key: "salaries",
      totalClassName: "text-[#F97316]",
      type: "line",
      yAxisWidth: 42,
      data: [
        { month: "Jan", value: 18200 },
        { month: "Feb", value: 18150 },
        { month: "Mar", value: 18600 },
        { month: "Apr", value: 18550 },
        { month: "May", value: 19000 },
        { month: "Jun", value: 18000 },
      ],
      yTicks: [0, 5000, 10000, 15000, 20000],
    },
  ]

  const expenseColorMap = {
    rent: "#10B981",
    utilities: "#3B82F6",
    supplies: "#8B5CF6",
    marketing: "#F59E0B",
    insurance: "#EF4444",
  } as const

  const orderStatusColorMap = {
    New: "bg-blue-100 text-blue-700",
    Cooking: "bg-orange-100 text-orange-700",
    Ready: "bg-purple-100 text-purple-700",
    Delivered: "bg-emerald-100 text-emerald-700",
  } as const

  const salaryExpensePercent =
    data.expenses.total > 0 ? Math.round((data.expenses.salary / data.expenses.total) * 100) : 0
  const otherExpensePercent = Math.max(100 - salaryExpensePercent, 0)

  const expenseDistribution: ExpenseItem[] = [
    {
      name: "Salary",
      value: salaryExpensePercent,
      amount: data.expenses.salary,
      key: "rent",
    },
    {
      name: "Other Expenses",
      value: otherExpensePercent,
      amount: otherExpensesAmount,
      key: "utilities",
    },
  ]

  const orderRows: OrderRow[] = data.recentOrders.map((order, index) => ({
    orderId: order.orderId ?? `#ORDER-${index + 1}`,
    customer: order.customer ?? "N/A",
    customerAgo: order.customerAgo ?? "Just now",
    items: order.items ?? "N/A",
    amount: formatCurrency(parseNumericValue(order.amount)),
    status: order.status ?? "New",
  }))

  const popularItems: PopularItem[] = data.popularItems.map((item, index) => ({
    name: item.name ?? `Item ${index + 1}`,
    ordersToday: item.ordersToday ?? 0,
    price: formatCurrency(parseNumericValue(item.price)),
    image:
      item.image ??
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&q=80",
  }))

  return (
    <div className="p-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening in your restaurant today."
        right={
          <>
            <Calendar className="mr-1 h-4 w-4" />
            <span>Feb 20, 2026, 10:30 AM</span>
          </>
        }
      />

      {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <StatsCard key={s.title} {...s} />
            ))}
          </div>

          <MonthlyReportSection
            cards={monthlyReportCards}
            reportColorMap={reportColorMap}
          />

          <ExpenseBreakdownSection
            items={expenseDistribution}
            colorMap={expenseColorMap}
          />

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <RecentOrdersSection
              rows={orderRows}
              statusClasses={orderStatusColorMap}
            />
            <PopularItemsSection items={popularItems} />
          </div>
        </>
      )}
    </div>
  )
}
