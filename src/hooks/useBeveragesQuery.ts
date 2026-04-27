import { useQuery } from "@tanstack/react-query"

import { getBeverages } from "@/lib/inventory-api"

export function useBeveragesQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["inventory", "beverages", page, limit],
    queryFn: () => getBeverages(page, limit),
  })
}
