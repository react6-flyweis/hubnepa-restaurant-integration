import api from "@/lib/api"

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type DashboardExpenseSummary = {
  total: number
  salary: number
}

export type DashboardRatingSummary = {
  average: number
  count: number
}

export type DashboardOrder = {
  orderId?: string
  customer?: string
  customerAgo?: string
  items?: string
  amount?: number | string
  status?: string
}

export type DashboardPopularItem = {
  name?: string
  ordersToday?: number
  price?: number | string
  image?: string
}

export type DashboardData = {
  totalOrders: number
  monthRevenue: number
  pendingOrders: number
  recentOrders: DashboardOrder[]
  popularItems: DashboardPopularItem[]
  staffCount: number
  expenses: DashboardExpenseSummary
  rating: DashboardRatingSummary
}

export async function getDashboardData(): Promise<DashboardData> {
  const response = await api.get<ApiResponse<DashboardData>>(
    "/restaurant-panel/dashboard"
  )

  return response.data.data
}
