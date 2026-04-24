import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"

import { login } from "@/lib/auth-api"
import { useAuthStore } from "@/stores/authStore"

export function usePartnerLoginMutation() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: login,
    onSuccess: (payload) => {
      setAuth(payload)
      navigate("/dashboard", { replace: true })
    },
  })
}
