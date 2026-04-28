import { useMutation } from "@tanstack/react-query"

import { createStaff } from "@/lib/staff-api"

export function useCreateStaffMutation() {
  return useMutation({
    mutationFn: createStaff,
  })
}
