import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useCreateStaffMutation } from "@/hooks/useCreateStaffMutation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Key } from "lucide-react"

export type NewStaff = {
  fullName: string
  role: string
  email: string
  phone: string
  shiftType: string
  startDate: string
}

const addStaffSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  role: z.string().min(1, "Role is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  shiftType: z.string().min(1, "Shift type is required"),
  startDate: z.string().min(1, "Start date is required"),
})

type AddStaffValues = z.infer<typeof addStaffSchema>

interface AddStaffDialogProps {
  open: boolean
  onClose: () => void
  onSubmit?: (values: AddStaffValues) => void
}

// some sample picklists matching what TeamManagementPage uses elsewhere
const roles = [
  "Manager",
  "Head Chef",
  "Chef",
  "Front Staff",
  "Host",
  "Dishwasher",
]

const shiftTypes = ["Morning", "Afternoon", "Evening", "Night"]

export function AddStaffDialog({
  open,
  onClose,
  onSubmit,
}: AddStaffDialogProps) {
  const queryClient = useQueryClient()
  const createStaffMutation = useCreateStaffMutation()
  const form = useForm<AddStaffValues>({
    resolver: zodResolver(addStaffSchema),
    defaultValues: {
      fullName: "",
      role: "",
      email: "",
      phone: "",
      shiftType: "",
      startDate: "",
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        fullName: "",
        role: "",
        email: "",
        phone: "",
        shiftType: "",
        startDate: "",
      })
    }
  }, [open, form])

  function handleSubmit(values: AddStaffValues) {
    createStaffMutation.mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["staff"],
        })
        onSubmit?.(values)
        onClose()
      },
    })
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="w-full sm:max-w-2xl p-6">
        <h2 className="text-lg font-medium text-slate-900">
          Add New Staff Member
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Create a profile for a new employee. They will receive an email with
          their login code.
        </p>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 space-y-4"
          noValidate
        >
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="e.g. John Doe"
              className="mt-1"
              {...form.register("fullName")}
            />
            {form.formState.errors.fullName && (
              <p className="mt-1 text-xs text-red-600">
                {form.formState.errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Controller
              name="role"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="role" className="mt-1 w-full">
                    <SelectValue placeholder="select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.role && (
              <p className="mt-1 text-xs text-red-600">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="mt-1"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+12125550099"
                className="mt-1"
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <Label htmlFor="shiftType">Shift Type</Label>
              <Controller
                name="shiftType"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="shiftType" className="mt-1 w-full">
                      <SelectValue placeholder="select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      {shiftTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.shiftType && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.shiftType.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                className="mt-1"
                {...form.register("startDate")}
              />
              {form.formState.errors.startDate && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.startDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
            <Key className="size-4" />
            <span>
              A unique 4-digit login code will be generated automatically.
            </span>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600"
              disabled={createStaffMutation.isPending}
            >
              {createStaffMutation.isPending ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
