import { useQuery } from "@tanstack/react-query"

import { getKitchenItems } from "@/lib/inventory-api"

export function useKitchenItemsQuery(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["inventory", "kitchen-items", page, limit],
    queryFn: () => getKitchenItems(page, limit),
  })
}
