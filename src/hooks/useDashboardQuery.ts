import { useQuery } from "@tanstack/react-query"

import { getDashboardData } from "@/lib/dashboard-api"

export function useDashboardQuery() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  })
}
