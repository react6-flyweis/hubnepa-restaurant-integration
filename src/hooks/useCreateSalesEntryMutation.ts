import { useMutation } from "@tanstack/react-query"

import {
  createSalesEntry,
  type CreateSalesEntryPayload,
  type SalesApiEntry,
} from "@/lib/sales-api"

export function useCreateSalesEntryMutation() {
  return useMutation<SalesApiEntry, Error, CreateSalesEntryPayload>({
    mutationFn: createSalesEntry,
  })
}
