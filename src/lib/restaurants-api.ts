import api from "@/lib/api"
import type { Restaurant } from "@/components/home/RestaurantCard"

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type RestaurantsPagination = {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

type RestaurantApiItem = {
  _id: string
  name: string
  slug: string
  logo: string | null
  cuisine: string[]
  tags: string[]
  deliveryTime: { min: number; max: number }
  rating: { average: number; count: number }
  deliveryFee: number
  minimumOrder: number
  isExclusivePartner: boolean
  distanceInMiles: number | null
  isOpen: boolean
}

type RestaurantsApiData = {
  data: RestaurantApiItem[]
  pagination: RestaurantsPagination
}

export type RestaurantCardItem = Restaurant & { id: string }

export type RestaurantsResult = {
  restaurants: RestaurantCardItem[]
  pagination: RestaurantsPagination
}

function mapRestaurantToCard(restaurant: RestaurantApiItem): RestaurantCardItem {
  const [category = "Restaurant", subcategory] = restaurant.cuisine
  const safeRating = Number.isFinite(restaurant.rating.average)
    ? restaurant.rating.average
    : 0

  return {
    id: restaurant._id,
    name: restaurant.name,
    category,
    subcategory,
    time: `${restaurant.deliveryTime.min}-${restaurant.deliveryTime.max} min`,
    distance:
      typeof restaurant.distanceInMiles === "number"
        ? `${restaurant.distanceInMiles.toFixed(1)} mi`
        : "N/A",
    rating: safeRating,
    deliveryFee:
      restaurant.deliveryFee === 0 ? "Free" : `$${restaurant.deliveryFee.toFixed(2)}`,
    ratingsCount: String(restaurant.rating.count),
    tags: restaurant.tags,
    badge: restaurant.isExclusivePartner ? "Exclusive Partner" : undefined,
    image:
      restaurant.logo ??
      `https://picsum.photos/seed/${restaurant.slug || restaurant._id}/400/240`,
    premium: restaurant.isOpen ? "Open" : "Closed",
    minOrder: `$${restaurant.minimumOrder}`,
  }
}

export async function getRestaurants(
  page = 1,
  limit = 10
): Promise<RestaurantsResult> {
  const response = await api.get<ApiResponse<RestaurantsApiData>>("/restaurants", {
    params: { page, limit },
  })

  const restaurants = response.data.data.data.map(mapRestaurantToCard)

  return {
    restaurants,
    pagination: response.data.data.pagination,
  }
}
