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


export default api
