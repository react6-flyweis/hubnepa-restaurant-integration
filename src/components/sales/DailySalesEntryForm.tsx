import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarDays } from "lucide-react"
import { useEffect } from "react"
import { type UseFormReturn, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useCreateSalesEntryMutation } from "@/hooks/useCreateSalesEntryMutation"
import { formatCurrency } from "@/lib/utils"
import type { CreateSalesEntryPayload } from "@/lib/sales-api"

const salesEntrySchema = z.object({
  reportingDate: z.string().min(1, "Select a reporting date"),
  inHouseDineIn: z.number().min(0, "Enter 0 or greater"),
  inHouseTakeOut: z.number().min(0, "Enter 0 or greater"),
  event: z.number().min(0, "Enter 0 or greater"),
  catering: z.number().min(0, "Enter 0 or greater"),
  uberEats: z.number().min(0, "Enter 0 or greater"),
  deliveroo: z.number().min(0, "Enter 0 or greater"),
  grubHub: z.number().min(0, "Enter 0 or greater"),
  justEat: z.number().min(0, "Enter 0 or greater"),
  instaCart: z.number().min(0, "Enter 0 or greater"),
  doorDash: z.number().min(0, "Enter 0 or greater"),
  ezeCater: z.number().min(0, "Enter 0 or greater"),
  other: z.number().min(0, "Enter 0 or greater"),
})

export type SalesEntryFormValues = z.infer<typeof salesEntrySchema>
export type SalesPlatformFieldName = Exclude<
  keyof SalesEntryFormValues,
  "reportingDate"
>
type SalesCategory = "inHouse" | "delivery"

type SalesFieldConfig = {
  label: string
  name: SalesPlatformFieldName
  category: SalesCategory
}

export type SalesBreakdown = Record<SalesPlatformFieldName, number>
export type SalesStatus = "Verified" | "Pending Review"
export type SalesRecord = {
  date: string
  status: SalesStatus
  platforms: SalesBreakdown
}

export const salesFieldConfigs: SalesFieldConfig[] = [
  { label: "In House Dine-In", name: "inHouseDineIn", category: "inHouse" },
  { label: "In House Take Out", name: "inHouseTakeOut", category: "inHouse" },
  { label: "Event", name: "event", category: "inHouse" },
  { label: "Catering", name: "catering", category: "inHouse" },
  { label: "Uber Eats", name: "uberEats", category: "delivery" },
  { label: "Deliveroo", name: "deliveroo", category: "delivery" },
  { label: "GrubHub", name: "grubHub", category: "delivery" },
  { label: "JustEat", name: "justEat", category: "delivery" },
  { label: "InstaCart", name: "instaCart", category: "delivery" },
  { label: "DoorDash", name: "doorDash", category: "delivery" },
  { label: "EzeCater", name: "ezeCater", category: "delivery" },
  { label: "Other", name: "other", category: "delivery" },
]

export const inHouseFieldNames = salesFieldConfigs
  .filter((field) => field.category === "inHouse")
  .map((field) => field.name)

export const deliveryFieldNames = salesFieldConfigs
  .filter((field) => field.category === "delivery")
  .map((field) => field.name)

const defaultStatusByTotal = {
  verifiedThreshold: 1,
} as const

interface DailySalesEntryFormProps {
  defaultDate?: string
  onSaved?: (record: SalesRecord) => void
}

function SalesAmountField({
  field,
  values,
}: {
  field: SalesFieldConfig
  values: UseFormReturn<SalesEntryFormValues>
}) {
  const error = values.formState.errors[field.name]?.message

  return (
    <Field className="gap-2">
      <FieldLabel
        htmlFor={field.name}
        className="text-[15px] font-medium text-slate-600"
      >
        {field.label}
      </FieldLabel>

      <Input
        id={field.name}
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        aria-invalid={Boolean(error)}
        className="h-11 rounded-[14px] border-slate-200 bg-[#F8FAFC] px-4 text-base text-slate-700 shadow-none"
        {...values.register(field.name, {
          setValueAs: (value) => {
            if (value === "" || value == null) {
              return 0
            }

            return Number(value)
          },
        })}
      />

      {typeof error === "string" ? (
        <FieldError className="text-xs">{error}</FieldError>
      ) : null}
    </Field>
  )
}

export function DailySalesEntryForm({
  defaultDate,
  onSaved,
}: DailySalesEntryFormProps) {
  const createSalesEntryMutation = useCreateSalesEntryMutation()
  const form = useForm<SalesEntryFormValues>({
    resolver: zodResolver(salesEntrySchema),
    defaultValues: createBlankSalesValues(defaultDate ?? getTodayDateValue()),
  })
  const watchedValues = form.watch()

  const currentInHouseTotal = sumFields(watchedValues, inHouseFieldNames)
  const currentDeliveryTotal = sumFields(watchedValues, deliveryFieldNames)
  const currentTotal = currentInHouseTotal + currentDeliveryTotal

  useEffect(() => {
    if (defaultDate) {
      form.reset(createBlankSalesValues(defaultDate))
    }
  }, [defaultDate, form])

  function handleSubmit(values: SalesEntryFormValues) {
    const payload = buildSalesPayload(values)
    const record = createSalesRecord(
      values.reportingDate,
      extractPlatforms(values)
    )

    createSalesEntryMutation.mutate(payload, {
      onSuccess: () => {
        onSaved?.(record)
        form.reset(createBlankSalesValues(values.reportingDate))
      },
    })
  }

  return (
    <Card className="py-0 xl:row-start-1">
      <CardHeader className="gap-4 border-b px-6 py-5 md:grid-cols-[1fr_180px] md:items-start">
        <div>
          <CardTitle className="font-display text-[1.65rem] leading-none text-slate-900">
            Daily Sales Entry
          </CardTitle>
          <CardDescription className="mt-2 max-w-sm text-[15px] leading-6 text-slate-500">
            Enter end-of-day sales figures for each platform.
          </CardDescription>
        </div>

        <Field className="gap-2">
          <FieldLabel htmlFor="reportingDate" className="sr-only">
            Reporting Date
          </FieldLabel>

          <div className="flex items-center gap-3">
            <CalendarDays className="size-6 text-slate-400" />
            <Input
              id="reportingDate"
              type="date"
              aria-invalid={Boolean(form.formState.errors.reportingDate)}
              className="h-10 border-slate-200 bg-[#F8FAFC] text-sm text-slate-700 shadow-none"
              {...form.register("reportingDate")}
            />
          </div>

          {typeof form.formState.errors.reportingDate?.message === "string" ? (
            <FieldError className="text-xs">
              {form.formState.errors.reportingDate.message}
            </FieldError>
          ) : null}
        </Field>
      </CardHeader>

      <CardContent className="px-6 py-6">
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {salesFieldConfigs.map((field) => (
              <SalesAmountField key={field.name} field={field} values={form} />
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Daily Revenue</p>
              <p className="mt-1 text-[2rem] leading-none font-semibold tracking-[-0.02em] text-slate-900">
                {formatCurrency(currentTotal)}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                In-house {formatCurrency(currentInHouseTotal)} • Delivery apps{" "}
                {formatCurrency(currentDeliveryTotal)}
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-11 rounded-xl px-5 text-sm font-semibold shadow-sm"
              disabled={createSalesEntryMutation.isPending}
            >
              {createSalesEntryMutation.isPending
                ? "Saving..."
                : "Save Daily Report"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function createBlankSalesValues(reportingDate: string): SalesEntryFormValues {
  return {
    reportingDate,
    inHouseDineIn: 0,
    inHouseTakeOut: 0,
    event: 0,
    catering: 0,
    uberEats: 0,
    deliveroo: 0,
    grubHub: 0,
    justEat: 0,
    instaCart: 0,
    doorDash: 0,
    ezeCater: 0,
    other: 0,
  }
}

function getTodayDateValue() {
  return new Date().toISOString().slice(0, 10)
}

function buildSalesPayload(
  values: SalesEntryFormValues
): CreateSalesEntryPayload {
  return {
    date: values.reportingDate,
    inHouseSales: values.inHouseDineIn + values.inHouseTakeOut,
    uberEatsSales: values.uberEats,
    deliverooSales: values.deliveroo,
    grubHubSales: values.grubHub,
    justEatSales: values.justEat,
    instaCartSales: values.instaCart,
    doordashSales: values.doorDash,
    ezeCaterSales: values.ezeCater,
    cateringSales: values.catering,
    otherSales: values.event + values.other,
  }
}

function extractPlatforms(values: SalesEntryFormValues): SalesBreakdown {
  return {
    inHouseDineIn: values.inHouseDineIn,
    inHouseTakeOut: values.inHouseTakeOut,
    event: values.event,
    catering: values.catering,
    uberEats: values.uberEats,
    deliveroo: values.deliveroo,
    grubHub: values.grubHub,
    justEat: values.justEat,
    instaCart: values.instaCart,
    doorDash: values.doorDash,
    ezeCater: values.ezeCater,
    other: values.other,
  }
}

function createSalesRecord(
  date: string,
  platforms: SalesBreakdown
): SalesRecord {
  return {
    date,
    status:
      getTotalSales(platforms) >= defaultStatusByTotal.verifiedThreshold
        ? "Verified"
        : "Pending Review",
    platforms,
  }
}

function sumFields(
  values: Partial<SalesEntryFormValues>,
  fieldNames: SalesPlatformFieldName[]
) {
  return fieldNames.reduce(
    (total, fieldName) => total + Number(values[fieldName] ?? 0),
    0
  )
}

function getTotalSales(platforms: SalesBreakdown) {
  return (
    inHouseFieldNames.reduce(
      (total, fieldName) => total + platforms[fieldName],
      0
    ) +
    deliveryFieldNames.reduce(
      (total, fieldName) => total + platforms[fieldName],
      0
    )
  )
}
