import { useMutation } from "@tanstack/react-query"

import {
  addBeverage,
  type AddBeveragePayload,
  type BeverageRecord,
} from "@/lib/inventory-api"

export function useAddBeverageMutation() {
  return useMutation<BeverageRecord, Error, AddBeveragePayload>({
    mutationFn: addBeverage,
  })
}
