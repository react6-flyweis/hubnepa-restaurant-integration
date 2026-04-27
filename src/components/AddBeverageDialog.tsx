import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useAddBeverageMutation } from "@/hooks/useAddBeverageMutation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const addBeverageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  unit: z.string().min(1, "Unit is required"),
  currentStock: z.number().min(0),
  minThreshold: z.number().min(0),
  costPerUnit: z.number().min(0),
})

export type AddBeverageValues = z.infer<typeof addBeverageSchema>

interface AddBeverageDialogProps {
  open: boolean
  onClose: () => void
}

export function AddBeverageDialog({
  open,
  onClose,
}: AddBeverageDialogProps) {
  const queryClient = useQueryClient()
  const addBeverageMutation = useAddBeverageMutation()
  const form = useForm<AddBeverageValues>({
    resolver: zodResolver(addBeverageSchema),
    defaultValues: {
      name: "",
      category: "",
      unit: "",
      currentStock: 0,
      minThreshold: 0,
      costPerUnit: 0,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        category: "",
        unit: "",
        currentStock: 0,
        minThreshold: 0,
        costPerUnit: 0,
      })
    }
  }, [open, form])

  function handleSubmit(values: AddBeverageValues) {
    addBeverageMutation.mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["inventory", "beverages"],
        })
        onClose()
      },
    })
  }

  if (!open) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="w-full max-w-md p-6">
        <h2 className="text-lg font-medium text-slate-900">Add New Beverage</h2>
        <p className="mt-1 text-sm text-slate-500">
          Create a new beverage item to track in stock.
        </p>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 space-y-4"
          noValidate
        >
          <div>
            <Label htmlFor="name">Beverage Name</Label>
            <Input
              id="name"
              placeholder="e.g. San Pellegrino Sparkling Water"
              className="mt-1"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="mt-1 text-xs text-red-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              {...form.register("category")}
            >
              <option value="" disabled>
                -- select category --
              </option>
              <option value="Soft Drink">Soft Drink</option>
              <option value="Juice">Juice</option>
              <option value="Water">Water</option>
              <option value="Tea">Tea</option>
              <option value="Coffee">Coffee</option>
              <option value="Alcohol">Alcohol</option>
              <option value="Other">Other</option>
            </select>
            {form.formState.errors.category && (
              <p className="mt-1 text-xs text-red-600">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              placeholder="e.g. bottles"
              className="mt-1"
              {...form.register("unit")}
            />
            {form.formState.errors.unit && (
              <p className="mt-1 text-xs text-red-600">
                {form.formState.errors.unit.message}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="currentStock">Current Stock</Label>
              <Input
                id="currentStock"
                type="number"
                min={0}
                className="mt-1"
                {...form.register("currentStock", { valueAsNumber: true })}
              />
              {form.formState.errors.currentStock && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.currentStock.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <Label htmlFor="minThreshold">Low Alert At</Label>
              <Input
                id="minThreshold"
                type="number"
                min={0}
                className="mt-1"
                {...form.register("minThreshold", { valueAsNumber: true })}
              />
              {form.formState.errors.minThreshold && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.minThreshold.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <Label htmlFor="costPerUnit">Cost per Unit</Label>
              <Input
                id="costPerUnit"
                type="number"
                step="0.01"
                min={0}
                className="mt-1"
                {...form.register("costPerUnit", { valueAsNumber: true })}
              />
              {form.formState.errors.costPerUnit && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.costPerUnit.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={addBeverageMutation.isPending}
            >
              {addBeverageMutation.isPending ? "Adding..." : "Add Beverage"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
