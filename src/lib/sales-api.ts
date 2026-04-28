import api from "@/lib/api"

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type CreateSalesEntryPayload = {
  date: string
  inHouseSales: number
  uberEatsSales: number
  deliverooSales: number
  grubHubSales: number
  justEatSales: number
  instaCartSales: number
  doordashSales: number
  ezeCaterSales: number
  cateringSales: number
  otherSales: number
}

export type SalesApiEntry = {
  restaurant: string
  date: string
  inHouseSales: number
  uberEatsSales: number
  deliverooSales: number
  grubHubSales: number
  justEatSales: number
  instaCartSales: number
  doordashSales: number
  ezeCaterSales: number
  cateringSales: number
  otherSales: number
  totalRevenue: number
  status: string
  submittedBy: string
  _id: string
  createdAt: string
  updatedAt: string
  __v: number
}

type SalesEntryResponseData = {
  entry: SalesApiEntry
}

export async function createSalesEntry(payload: CreateSalesEntryPayload) {
  const response = await api.post<ApiResponse<SalesEntryResponseData>>(
    "/restaurant-panel/sales-closing",
    payload
  )

  return response.data.data.entry
}
