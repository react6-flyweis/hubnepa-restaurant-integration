import { useMutation, useQueryClient } from "@tanstack/react-query"

import { resolveMaintenanceIssue } from "@/lib/maintenance-api"

export function useResolveMaintenanceIssueMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: resolveMaintenanceIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["maintenance-logs"],
      })
    },
  })
}
