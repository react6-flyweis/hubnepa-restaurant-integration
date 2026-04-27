import { useQuery } from "@tanstack/react-query"

import { getLiveOrders } from "@/lib/live-orders-api"

export function useLiveOrdersQuery() {
  return useQuery({
    queryKey: ["live-orders"],
    queryFn: getLiveOrders,
  })
}
