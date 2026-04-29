import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  addKitchenItem,
  type AddKitchenItemPayload,
  type KitchenItemRecord,
} from "@/lib/inventory-api"

export function useAddKitchenItemMutation() {
  const queryClient = useQueryClient()

  return useMutation<KitchenItemRecord, Error, AddKitchenItemPayload>({
    mutationFn: addKitchenItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory", "kitchen-items", 1, 20],
      })
    },
  })
}
