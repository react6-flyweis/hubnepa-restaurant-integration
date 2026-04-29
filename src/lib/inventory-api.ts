import api from "@/lib/api"

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type AddBeveragePayload = {
  name: string
  category: string
  unit: string
  currentStock: number
  minThreshold: number
  costPerUnit: number
}

export type BeverageRecord = {
  _id: string
  name: string
  category: string
  currentStock: number
  minThreshold: number
  unitType: string
  costPerUnit: number
  status: "In Stock" | "Low" | "Out of Stock"
  restaurant: string
  createdAt: string
  updatedAt: string
}

type AddBeverageResponseData = {
  bev: BeverageRecord
}

export type Pagination = {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

type BeverageListResponseData = {
  data: BeverageRecord[]
  pagination: Pagination
}

export async function addBeverage(payload: AddBeveragePayload) {
  const response = await api.post<ApiResponse<AddBeverageResponseData>>(
    "/restaurant-panel/inventory/beverages",
    payload
  )

  return response.data.data.bev
}

export async function getBeverages(page = 1, limit = 10) {
  const response = await api.get<ApiResponse<BeverageListResponseData>>(
    "/restaurant-panel/inventory/beverages",
    {
      params: {
        page,
        limit,
      },
    }
  )

  return response.data.data
}
