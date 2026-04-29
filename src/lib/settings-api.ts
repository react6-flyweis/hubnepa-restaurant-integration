import api from "@/lib/api"

export type UpdateNotificationSettingsPayload = {
  newOrders: boolean
  orderUpdates: boolean
  lowInventory: boolean
  financialAlerts: boolean
}

export async function updateNotificationSettings(
  payload: UpdateNotificationSettingsPayload
) {
  const response = await api.post(
    "/restaurant-panel/settings/notifications",
    payload
  )

  return response.data?.data ?? response.data
}
