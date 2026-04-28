import api from "@/lib/api"

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type MaintenanceApiItem = {
  _id: string
  restaurant: string
  itemName: string
  priority: string
  issue: string
  status: string
  cost: number
  dateReported: string
  createdAt: string
  updatedAt: string
  __v: number
}

export type MaintenancePagination = {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type MaintenanceLogsApiData = {
  data: MaintenanceApiItem[]
  pagination: MaintenancePagination
}

export async function getMaintenanceLogs(): Promise<MaintenanceLogsApiData> {
  const response = await api.get<ApiResponse<MaintenanceLogsApiData>>(
    "/restaurant-panel/expenses/maintenance"
  )

  return response.data.data
}
