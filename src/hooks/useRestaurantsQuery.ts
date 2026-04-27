import { useQuery } from "@tanstack/react-query"

import { getRestaurants } from "@/lib/restaurants-api"

export function useRestaurantsQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["restaurants", page, limit],
    queryFn: () => getRestaurants(page, limit),
  })
}
