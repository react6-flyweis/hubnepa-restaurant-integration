import api from "@/lib/api"

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type PayrollApiItem = {
  _id: string
  restaurant: string
  staff: {
    _id: string
    fullName: string
    role: string
  }
  month: string
  hoursWorked: number
  hourlyRate: number
  baseSalary: number
  totalPay: number
  status: string
  createdAt: string
  updatedAt: string
  __v: number
}

export type PayrollPagination = {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type PayrollSummary = {
  _id: string | null
  total: number
  paid: number
  pending: number
}

export type PayrollApiData = {
  data: PayrollApiItem[]
  pagination: PayrollPagination
  summary: PayrollSummary
}

export async function getPayroll(): Promise<PayrollApiData> {
  const response = await api.get<ApiResponse<PayrollApiData>>(
    "/restaurant-panel/expenses/payroll"
  )

  return response.data.data
}
