import { useMutation } from "@tanstack/react-query"

import {
  updateNotificationSettings,
  type UpdateNotificationSettingsPayload,
} from "@/lib/settings-api"

export function useUpdateNotificationSettingsMutation() {
  return useMutation<void, Error, UpdateNotificationSettingsPayload>({
    mutationFn: updateNotificationSettings,
  })
}
