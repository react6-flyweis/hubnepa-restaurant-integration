import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAddKitchenItemMutation } from "@/hooks/useAddKitchenItemMutation"

// shape used by the dialog; callers can map this into whatever project model makes
// sense (e.g. InventoryItem used on the page)
export type NewInventoryItem = {
  name: string
  category: string
  itemType: "Raw" | "Solid"
  unitType: string
  initialStock: number
  lowAlert: number
  costPerUnit: number
}

const addItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  itemType: z.enum(["Raw", "Solid"]),
  unitType: z.string().min(1, "Unit of measure is required"),
  initialStock: z.number().min(0),
  lowAlert: z.number().min(0),
  costPerUnit: z.number().min(0),
})

type AddItemValues = z.infer<typeof addItemSchema>

interface AddInventoryItemDialogProps {
  open: boolean
  onClose: () => void
}

export function AddInventoryItemDialog({
  open,
  onClose,
}: AddInventoryItemDialogProps) {
  const [isSaving, setIsSaving] = useState(false)

  const addKitchenItemMutation = useAddKitchenItemMutation()

  const form = useForm<AddItemValues>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      name: "",
      category: "",
      itemType: "Raw",
      unitType: "",
      initialStock: 0,
      lowAlert: 0,
      costPerUnit: 0,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        category: "",
        itemType: "Raw",
        unitType: "",
        initialStock: 0,
        lowAlert: 0,
        costPerUnit: 0,
      })
    }
  }, [open, form])

  function handleSubmit(values: AddItemValues) {
    setIsSaving(true)

    addKitchenItemMutation.mutate(
      {
        itemName: values.name,
        category: values.category,
        itemType: values.itemType,
        unit: values.unitType,
        currentStock: values.initialStock,
        minThreshold: values.lowAlert,
        costPerUnit: values.costPerUnit,
      },
      {
        onSuccess: () => {
          setIsSaving(false)
          onClose()
        },
        onError: () => {
          setIsSaving(false)
        },
      }
    )
  }

  if (!open) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="w-full max-w-md p-6">
        <h2 className="text-lg font-medium text-slate-900">
          Add New Inventory Item
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Create a new raw ingredient or supply item to track.
        </p>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 space-y-4"
          noValidate
        >
          <Field>
            <FieldLabel htmlFor="name">Item Name</FieldLabel>
            <Input
              id="name"
              placeholder="e.g. Extra Virgin Olive Oil"
              className="mt-1"
              {...form.register("name")}
            />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <Controller
              name="category"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="category" className="mt-1 w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Produce",
                      "Beverage",
                      "Dairy",
                      "Grains",
                      "Protein",
                      "Other",
                    ].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[form.formState.errors.category]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="itemType">Item Type</FieldLabel>
            <Controller
              name="itemType"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="itemType" className="mt-1 w-full">
                    <SelectValue placeholder="Select item type" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { value: "Raw", label: "Raw" },
                      { value: "Solid", label: "Solid" },
                    ].map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[form.formState.errors.itemType]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="unitType">Unit of Measure</FieldLabel>
            <Controller
              name="unitType"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="unitType" className="mt-1 w-full">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { value: "kg", label: "Kilogram (kg)" },
                      { value: "L", label: "Liter (L)" },
                      { value: "bottles", label: "Bottles" },
                      { value: "pieces", label: "Pieces" },
                    ].map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[form.formState.errors.unitType]} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="initialStock">Initial Stock</FieldLabel>
              <Input
                id="initialStock"
                type="number"
                min={0}
                className="mt-1"
                {...form.register("initialStock", { valueAsNumber: true })}
              />
              <FieldError errors={[form.formState.errors.initialStock]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="lowAlert">Low Alert At</FieldLabel>
              <Input
                id="lowAlert"
                type="number"
                min={0}
                className="mt-1"
                {...form.register("lowAlert", { valueAsNumber: true })}
              />
              <FieldError errors={[form.formState.errors.lowAlert]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="costPerUnit">Cost per Unit</FieldLabel>
              <Input
                id="costPerUnit"
                type="number"
                step="0.01"
                min={0}
                className="mt-1"
                {...form.register("costPerUnit", { valueAsNumber: true })}
              />
              <FieldError errors={[form.formState.errors.costPerUnit]} />
            </Field>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={isSaving}
            >
              {isSaving ? "Saving…" : "Save Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
