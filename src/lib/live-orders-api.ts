import api from "@/lib/api"

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type LiveOrderApiItem = {
  id?: string
  orderId?: string
  age?: string
  timeAgo?: string
  fulfillmentType?: string
  orderType?: string
  customerName?: string
  customer?: string
  items?: string[] | string
  amount?: number | string
  total?: number | string
  status?: string
}

export type LiveOrdersData = {
  orders: LiveOrderApiItem[]
}

export async function getLiveOrders(): Promise<LiveOrdersData> {
  const response = await api.get<ApiResponse<LiveOrdersData>>(
    "/restaurant-panel/orders/live"
  )

  return response.data.data
}
