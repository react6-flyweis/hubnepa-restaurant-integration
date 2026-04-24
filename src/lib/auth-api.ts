import api from "@/lib/api"
import { useAuthStore, type AuthUser } from "@/stores/authStore"

export type LoginRequest = {
  email: string
  password: string
}

type LoginResponseData = {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export async function login(payload: LoginRequest): Promise<LoginResponseData> {
  const response = await api.post<ApiResponse<LoginResponseData>>(
    "/auth/login",
    payload
  )

  return response.data.data
}

