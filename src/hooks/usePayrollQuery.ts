import { useQuery } from "@tanstack/react-query"

import { getPayroll } from "@/lib/payroll-api"

export function usePayrollQuery() {
  return useQuery({
    queryKey: ["payroll"],
    queryFn: getPayroll,
  })
}
