import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router"

import { Loading } from "@/components/layouts/Loading"
import { useAuthStore } from "@/stores/authStore"

type AuthWrapperProps = {
  children: ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const location = useLocation()
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!hasHydrated) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/partner-login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <>{children}</>
}
