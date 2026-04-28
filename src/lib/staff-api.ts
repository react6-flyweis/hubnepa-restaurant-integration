import api from "@/lib/api"

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type StaffPagination = {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

type StaffApiItem = {
  _id: string
  restaurant: string
  fullName: string
  email: string
  phone: string
  role: string
  employmentType: string
  branch: string
  loginCode: string
  status: string
  startDate: string
  salary: number
  hourlyRate: number
  avatar: string | null
  createdAt: string
  updatedAt: string
  __v: number
}

type StaffListResponseData = {
  data: StaffApiItem[]
  pagination: StaffPagination
}

export type StaffMember = {
  id: string
  fullName: string
  email: string
  phone: string
  role: string
  employmentType: string
  branch: string
  loginCode: string
  status: string
  startDate: string
  avatarUrl: string
}

export type StaffListResult = {
  staff: StaffMember[]
  pagination: StaffPagination
}

export type CreateStaffPayload = {
  fullName: string
  role: string
  email: string
  phone: string
  shiftType: string
  startDate: string
}

function mapStaffMember(member: StaffApiItem): StaffMember {
  return {
    id: member._id,
    fullName: member.fullName,
    email: member.email,
    phone: member.phone,
    role: member.role,
    employmentType: member.employmentType,
    branch: member.branch,
    loginCode: member.loginCode,
    status: member.status,
    startDate: member.startDate,
    avatarUrl: member.avatar ?? "",
  }
}

export async function getStaff(page = 1, limit = 10): Promise<StaffListResult> {
  const response = await api.get<ApiResponse<StaffListResponseData>>(
    "/restaurant-panel/staff",
    {
      params: { page, limit },
    }
  )

  return {
    staff: response.data.data.data.map(mapStaffMember),
    pagination: response.data.data.pagination,
  }
}

export async function createStaff(
  payload: CreateStaffPayload
): Promise<StaffMember> {
  const response = await api.post<ApiResponse<StaffApiItem>>(
    "/restaurant-panel/staff",
    payload
  )

  return mapStaffMember(response.data.data)
}
