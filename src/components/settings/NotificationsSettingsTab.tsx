import { useMemo, useState } from "react"
import {
  DollarSign,
  MapPin,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useUpdateNotificationSettingsMutation } from "@/hooks/useUpdateNotificationSettingsMutation"
import type { UpdateNotificationSettingsPayload } from "@/lib/settings-api"

type NotificationPreferenceKey =
  | "newOrders"
  | "orderUpdates"
  | "lowInventory"
  | "financialAlerts"

type NotificationPreferenceItem = {
  key: NotificationPreferenceKey
  title: string
  description: string
  icon: LucideIcon
  enabled: boolean
}

const notificationPreferenceItems: NotificationPreferenceItem[] = [
  {
    key: "newOrders",
    title: "New Orders",
    description: "Receive alerts when a customer places a new order.",
    icon: UtensilsCrossed,
    enabled: true,
  },
  {
    key: "orderUpdates",
    title: "Order Updates",
    description: "Get notified about delivery status and driver arrivals.",
    icon: MapPin,
    enabled: true,
  },
  {
    key: "lowInventory",
    title: "Low Inventory",
    description: "Receive alerts when stock levels fall below a threshold.",
    icon: Users,
    enabled: true,
  },
  {
    key: "financialAlerts",
    title: "Financial Alerts",
    description: "Receive notifications for payouts and invoice events.",
    icon: DollarSign,
    enabled: true,
  },
]

const notificationSwitchColorMap = {
  enabled: {
    track: "bg-emerald-600",
    thumb: "translate-x-[22px] bg-white",
  },
  disabled: {
    track: "bg-slate-300",
    thumb: "translate-x-0 bg-white",
  },
} as const

function NotificationToggleButton({
  enabled,
  onToggle,
}: {
  enabled: boolean
  onToggle: () => void
}) {
  const switchColorKey = enabled ? "enabled" : "disabled"

  return (
    <button
      type="button"
      role="switch"
      aria-label={enabled ? "Turn off notification" : "Turn on notification"}
      aria-checked={enabled}
      onClick={onToggle}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        notificationSwitchColorMap[switchColorKey].track
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full transition-transform",
          notificationSwitchColorMap[switchColorKey].thumb
        )}
      />
    </button>
  )
}

function NotificationPreferenceRow({
  item,
  onToggle,
}: {
  item: NotificationPreferenceItem
  onToggle: (key: NotificationPreferenceItem["key"]) => void
}) {
  return (
    <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-500">
          <item.icon className="size-5" />
        </div>

        <div>
          <p className="font-display text-lg font-medium text-slate-900">
            {item.title}
          </p>
          <p className="text-sm text-slate-500">{item.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-600">
          {item.enabled ? "Enabled" : "Disabled"}
        </span>
        <NotificationToggleButton
          enabled={item.enabled}
          onToggle={() => onToggle(item.key)}
        />
      </div>
    </div>
  )
}

function buildPayload(
  preferences: NotificationPreferenceItem[]
): UpdateNotificationSettingsPayload {
  return preferences.reduce(
    (payload, item) => ({
      ...payload,
      [item.key]: item.enabled,
    }),
    {
      newOrders: false,
      orderUpdates: false,
      lowInventory: false,
      financialAlerts: false,
    }
  ) as UpdateNotificationSettingsPayload
}

export function NotificationsSettingsTab() {
  const [preferences, setPreferences] = useState<NotificationPreferenceItem[]>(
    notificationPreferenceItems
  )
  const updateNotificationSettingsMutation =
    useUpdateNotificationSettingsMutation()

  const isSaving = updateNotificationSettingsMutation.isPending
  const saveMessage = useMemo(() => {
    if (updateNotificationSettingsMutation.isSuccess) {
      return "Notification settings saved successfully."
    }
    if (updateNotificationSettingsMutation.isError) {
      return updateNotificationSettingsMutation.error.message
    }
    return null
  }, [
    updateNotificationSettingsMutation.error,
    updateNotificationSettingsMutation.isError,
    updateNotificationSettingsMutation.isSuccess,
  ])

  function handleToggle(key: NotificationPreferenceKey) {
    setPreferences((currentPreferences) =>
      currentPreferences.map((item) =>
        item.key === key ? { ...item, enabled: !item.enabled } : item
      )
    )
  }

  function handleSave() {
    updateNotificationSettingsMutation.mutate(buildPayload(preferences))
  }

  return (
    <Card className="mt-6 rounded-xl border border-slate-200 shadow-none">
      <CardHeader className="px-6">
        <CardTitle className="font-display text-lg font-semibold text-slate-900">
          Notification Preferences
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Choose how you want to be notified about important updates.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 pb-1">
        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {preferences.map((item) => (
            <NotificationPreferenceRow
              key={item.key}
              item={item}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 px-6 pt-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {saveMessage ? (
            <p
              className={cn(
                "text-sm",
                updateNotificationSettingsMutation.isSuccess
                  ? "text-emerald-600"
                  : "text-destructive"
              )}
            >
              {saveMessage}
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          {isSaving ? "Saving..." : "Save Notification Settings"}
        </Button>
      </CardFooter>
    </Card>
  )
}
