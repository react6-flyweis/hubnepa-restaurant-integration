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



export async function addBeverage(payload: AddBeveragePayload) {
  const response = await api.post<ApiResponse<AddBeverageResponseData>>(
    "/restaurant-panel/inventory/beverages",
    payload
  )

  return response.data.data.bev
}

