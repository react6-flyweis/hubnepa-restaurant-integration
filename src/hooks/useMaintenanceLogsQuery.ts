import { useQuery } from "@tanstack/react-query"

import { getMaintenanceLogs } from "@/lib/maintenance-api"

export function useMaintenanceLogsQuery() {
  return useQuery({
    queryKey: ["maintenance-logs"],
    queryFn: getMaintenanceLogs,
  })
}
