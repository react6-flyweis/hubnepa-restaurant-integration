import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "react-router"
import { ChefHat, ForkKnife, type LucideIcon } from "lucide-react"

interface CTA {
  title: string
  description: string
  href: string
  buttonLabel: string
  icon: LucideIcon
  bgClass: string
  textClass: string
}

const ctas: CTA[] = [
  {
    title: "Order Food",
    description: "Browse menus and order delivery.",
    href: "#",
    buttonLabel: "Order Now",
    icon: ForkKnife,
    bgClass: "bg-orange-600/10",
    textClass: "text-orange-400",
  },
  {
    title: "Partner with Us",
    description: "Grow your restaurant business.",
    href: "/partner-login",
    buttonLabel: "Join Now",
    icon: ChefHat,
    bgClass: "bg-primary/10",
    textClass: "text-primary",
  },
]

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#020618] px-6 py-24 text-white sm:px-8 lg:px-10">
      <div className="relative mx-auto max-w-6xl text-center">
        <h2 className="font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-[3.6rem]">
          Ready to get started?
        </h2>
        <p className="mt-4 text-base leading-8 text-slate-300 sm:text-lg">
          Join the fastest growing food community.
        </p>

        <div className="mx-auto mt-12 grid max-w-2xl gap-8 lg:grid-cols-2">
          {ctas.map((cta) => {
            const Icon = cta.icon

            return (
              <Card
                key={cta.title}
                className="rounded-lg border border-white/10 bg-[#0F172B99]"
              >
                <CardContent className="flex h-full flex-col justify-between p-6">
                  <div>
                    <div
                      className={cn(
                        "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full",
                        cta.bgClass,
                        cta.textClass
                      )}
                    >
                      <Icon className="size-6" />
                    </div>

                    <h3 className="text-xl font-semibold text-white">
                      {cta.title}
                    </h3>
                    <p className="mt-3 text-sm text-slate-300">
                      {cta.description}
                    </p>
                  </div>

                  <Button
                    asChild
                    variant="link"
                    className={cn("mt-4 p-0 font-semibold", cta.textClass)}
                  >
                    <Link to={cta.href}>{cta.buttonLabel}</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
