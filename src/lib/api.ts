import axios from "axios"
import type { AxiosError, InternalAxiosRequestConfig } from "axios"

import { useAuthStore } from "@/stores/authStore"

const api = axios.create({
  baseURL: "https://hubnepa-backend.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
})

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

let isRefreshing = false
let pendingRequests: Array<(token: string | null) => void> = []

const resolvePendingRequests = (token: string | null) => {
  pendingRequests.forEach((callback) => callback(token))
  pendingRequests = []
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined
    const statusCode = error.response?.status

    if (!originalRequest || statusCode !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (originalRequest.url?.includes("/auth/refresh-token")) {
      return Promise.reject(error)
    }

    const authState = useAuthStore.getState()

    if (!authState.refreshToken) {
      authState.clearAuth()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push((token) => {
          if (!token) {
            reject(error)
            return
          }

          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(api(originalRequest))
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const refreshResponse = await axios.post(
        `${api.defaults.baseURL}/auth/refresh-token`,
        { refreshToken: authState.refreshToken },
        {
          headers: { "Content-Type": "application/json" },
        }
      )

      const refreshData = refreshResponse.data?.data ?? refreshResponse.data
      const newAccessToken = refreshData?.accessToken as string | undefined
      const newRefreshToken =
        (refreshData?.refreshToken as string | undefined) ?? authState.refreshToken

      if (!newAccessToken) {
        throw new Error("Refresh response does not include accessToken")
      }

      useAuthStore.setState({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        isAuthenticated: true,
      })

      resolvePendingRequests(newAccessToken)
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      return api(originalRequest)
    } catch (refreshError) {
      resolvePendingRequests(null)
      useAuthStore.getState().clearAuth()

      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
