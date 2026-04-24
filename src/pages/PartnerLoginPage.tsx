import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeft,
  ArrowRight,
  ChefHat,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react"
import { useEffect, useState, type ComponentType } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { z } from "zod"

import authBackground from "@/assets/auth-bg.jpg"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { extractErrorMessage } from "@/lib/error-handler"
import { cn } from "@/lib/utils"
import Header from "@/components/layouts/Header"
import Footer from "@/components/layouts/Footer"
import { useAuthStore } from "@/stores/authStore"
import { usePartnerLoginMutation } from "../hooks/usePartnerLoginMutation"

const partnerLoginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberDevice: z.boolean().optional(),
})

type PartnerLoginFormValues = z.infer<typeof partnerLoginSchema>
type PartnerLoginFieldName = Exclude<
  keyof PartnerLoginFormValues,
  "rememberDevice"
>

type PartnerLoginFieldConfig = {
  name: PartnerLoginFieldName
  label: string
  placeholder: string
  icon: ComponentType<{ className?: string }>
}

const partnerLoginFields: PartnerLoginFieldConfig[] = [
  {
    name: "email",
    label: "Email Address",
    placeholder: "name@hubnepa.com",
    icon: Mail,
  },
  {
    name: "password",
    label: "Password",
    placeholder: "••••••••",
    icon: Lock,
  },
]

function PartnerLoginInputField({
  field,
  values,
  isPasswordVisible,
  onTogglePasswordVisibility,
}: {
  field: PartnerLoginFieldConfig
  values: ReturnType<typeof useForm<PartnerLoginFormValues>>
  isPasswordVisible: boolean
  onTogglePasswordVisibility: () => void
}) {
  const Icon = field.icon
  const error = values.formState.errors[field.name]?.message
  const isPasswordField = field.name === "password"

  return (
    <Field>
      <div className="mb-2 flex items-center justify-between gap-4">
        <FieldLabel
          htmlFor={field.name}
          className="text-sm font-medium text-[#D6DCEE]"
        >
          {field.label}
        </FieldLabel>

        {isPasswordField ? (
          <Link
            to="/"
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Forgot password?
          </Link>
        ) : null}
      </div>

      <div className="relative">
        <Icon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#66708A]" />

        <Input
          id={field.name}
          type={
            isPasswordField
              ? isPasswordVisible
                ? "text"
                : "password"
              : "email"
          }
          placeholder={field.placeholder}
          aria-invalid={Boolean(error)}
          className={cn(
            "h-12 rounded-[14px] border border-[#17233F] bg-white/20 pl-12 text-[15px] text-[#EEF3FF] placeholder:text-[#4D5772] focus-visible:border-[#24497A] focus-visible:ring-[#14345C]/40",
            isPasswordField ? "pr-12" : "pr-4"
          )}
          {...values.register(field.name)}
        />

        {isPasswordField ? (
          <button
            type="button"
            onClick={onTogglePasswordVisibility}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-[#66708A] transition-colors hover:text-[#C5CCDF]"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            {isPasswordVisible ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        ) : null}
      </div>

      {typeof error === "string" ? (
        <FieldError className="mt-2 text-xs text-[#FF7A7A]">{error}</FieldError>
      ) : null}
    </Field>
  )
}

export default function PartnerLoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const loginMutation = usePartnerLoginMutation()

  const values = useForm<PartnerLoginFormValues>({
    resolver: zodResolver(partnerLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberDevice: false,
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true })
    }
  }, [isAuthenticated, navigate])

  async function onSubmit(data: PartnerLoginFormValues) {
    values.clearErrors("root.serverError")

    try {
      await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      })
    } catch (error) {
      values.setError("root.serverError", {
        type: "server",
        message: extractErrorMessage(
          error,
          "Unable to sign in right now. Please try again."
        ),
      })
    }
  }

  function togglePasswordVisibility() {
    setIsPasswordVisible((currentState) => !currentState)
  }

  const loginErrorMessage = values.formState.errors.root?.serverError?.message

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[#020816] text-white">
      <Header />

      <main className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,188,125,0.14),transparent_28%),linear-gradient(180deg,#030917_0%,#020816_100%)]" />

        <section className="relative grid min-h-[calc(100svh-145px)] lg:grid-cols-2">
          <div className="relative z-10 flex justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-8">
            <div className="flex w-full max-w-md flex-col justify-center">
              <Link
                to="/"
                className="mb-8 inline-flex items-center gap-2 text-sm text-[#98A4C0] transition-colors hover:text-white"
              >
                <ArrowLeft className="size-4" />
                Back
              </Link>

              <div className="mb-8 flex size-10 items-center justify-center rounded-xl bg-[#0A2B24] text-primary shadow-[0_0_0_1px_rgba(0,188,125,0.08)]">
                <ChefHat className="size-4" />
              </div>

              <div className="space-y-3">
                <h1 className="font-display text-5xl leading-tight tracking-[-0.03em] text-[#F4F7FF]">
                  Restaurant Backend
                </h1>
                <p className="max-w-sm text-lg leading-8 text-[#8D98B4]">
                  Manage your menu, orders, and kitchen performance.
                </p>
              </div>

              <form
                onSubmit={values.handleSubmit(onSubmit)}
                noValidate
                className="mt-10 space-y-5"
              >
                {partnerLoginFields.map((field) => (
                  <PartnerLoginInputField
                    key={field.name}
                    field={field}
                    values={values}
                    isPasswordVisible={isPasswordVisible}
                    onTogglePasswordVisibility={togglePasswordVisibility}
                  />
                ))}

                <label
                  htmlFor="rememberDevice"
                  className="flex items-center gap-3 text-sm text-[#97A3BF]"
                >
                  <input
                    id="rememberDevice"
                    type="checkbox"
                    className="size-4 rounded border border-[#24304C] bg-[#071026] accent-primary"
                    {...values.register("rememberDevice")}
                  />
                  <span>Remember this device</span>
                </label>

                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="h-14 w-full rounded-[14px] bg-[#01B13D] text-base font-semibold text-white shadow-[0_20px_40px_rgba(1,177,61,0.18)] hover:bg-[#01A739]"
                >
                  {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  <ArrowRight className="size-4" />
                </Button>

                {loginErrorMessage ? (
                  <p className="text-sm text-[#FF7A7A]">{loginErrorMessage}</p>
                ) : null}

                <div className="rounded-[14px] border border-[#17233F] bg-[#071026]/82 px-5 py-5 text-center">
                  <p className="text-sm text-[#7E8AA7]">
                    Need access to the Partner Portal?
                  </p>
                  <Button
                    asChild
                    variant="ghost"
                    className="mt-2 h-auto p-0 text-base font-semibold text-primary hover:bg-transparent hover:text-primary/80"
                  >
                    <Link to="/checkout?plan=gold">Apply for Partnership</Link>
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="relative min-h-90 overflow-hidden border-t border-white/6 lg:min-h-0 lg:border-t-0">
            <img
              src={authBackground}
              alt="Restaurant kitchen interior"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,8,22,0.96)_0%,rgba(2,8,22,0.88)_14%,rgba(2,8,22,0.52)_35%,rgba(2,8,22,0.2)_55%,rgba(2,8,22,0.56)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,188,125,0.16),transparent_25%),linear-gradient(180deg,rgba(2,8,22,0.04)_0%,rgba(2,8,22,0.42)_55%,rgba(2,8,22,0.9)_100%)]" />

            <div className="relative flex h-full items-end px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:pb-14">
              <div className="max-w-[410px] space-y-7">
                <span className="block h-1 w-13 rounded-full bg-primary" />

                <blockquote className="font-display text-4xl leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl">
                  "HubNepa aligns perfectly with our culinary standards."
                </blockquote>

                <div className="flex items-center gap-4">
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-[#03130C]">
                    E
                  </span>
                  <div>
                    <p className="text-base font-extrabold tracking-[0.04em] text-white uppercase">
                      Executive Chef
                    </p>
                    <p className="text-sm text-[#B5BED4]">Verified Partner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
