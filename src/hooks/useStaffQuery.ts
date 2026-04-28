import { useQuery } from "@tanstack/react-query"

import { getStaff } from "@/lib/staff-api"

export function useStaffQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["staff", page, limit],
    queryFn: () => getStaff(page, limit),
  })
}
