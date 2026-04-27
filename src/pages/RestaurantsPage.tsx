import React from "react"
import { Link } from "react-router"
import Header from "@/components/layouts/Header"
import Footer from "@/components/layouts/Footer"
import curatedBg from "@/assets/curated-bg.jpg"
import { useRestaurantsQuery } from "@/hooks/useRestaurantsQuery"
import { extractErrorMessage } from "@/lib/error-handler"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group"
import {
  Filter,
  Search,
  ForkKnife,
  ChefHat,
  Wine,
  Flame,
  Star,
} from "lucide-react"

import {
  RestaurantCard,
} from "@/components/home/RestaurantCard"

export default function RestaurantsPage() {
  const [activeFilter, setActiveFilter] = React.useState("All Cuisines")
  const { data, isLoading, error } = useRestaurantsQuery(1, 10)
  const restaurants = data?.restaurants ?? []
  const errorMessage = error
    ? extractErrorMessage(error, "Failed to load restaurants. Please try again.")
    : null

  const filters = [
    { label: "All Cuisines", icon: ForkKnife },
    { label: "Fine Dining", icon: ChefHat },
    { label: "Japanese", icon: Star },
    { label: "Italian", icon: Wine },
    { label: "American", icon: Flame },
  ]

  return (
    <div className="w-full bg-[#020618] text-white">
      <Header />

      {/* hero/search */}
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${curatedBg})` }}
        />
        <div
          className="absolute inset-0 h-full w-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(2, 6, 24, 0.5) 50%, #020618 100%)",
          }}
        />
        <div className="relative mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-6xl flex-col items-center justify-center px-6 py-24 sm:px-8 lg:px-10">
          <h1 className="font-display text-5xl font-semibold sm:text-6xl lg:text-7xl">
            The <span className="text-primary italic">Curated</span> List
          </h1>
          <p className="mt-3 max-w-2xl text-center text-base text-slate-300 sm:text-lg">
            The city&apos;s most celebrated kitchens, selected for quality,
            hygiene, and culinary artistry.
          </p>
          <div className="mt-8 flex w-full max-w-2xl items-center gap-2">
            <InputGroup className="h-12 grow rounded-full border-none bg-[#FFFFFF33] px-4">
              <InputGroupAddon align="inline-start" className="py-2 pr-2!">
                <Search className="text-slate-400" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search for 'Sushi', 'Pizza', or 'Mezze'..."
                className="text-slate-700 placeholder:text-slate-400"
              />
              <InputGroupButton className="h-full rounded-full bg-primary px-6 text-white hover:bg-primary/90">
                Find Table
              </InputGroupButton>
            </InputGroup>
          </div>
        </div>
      </section>

      {/* filters row */}
      <div className="mx-auto mt-6 flex w-full max-w-6xl flex-wrap items-center gap-3 px-6 sm:px-8 lg:px-10">
        <div className="flex items-baseline gap-3 border-r pr-5">
          {filters.map((f) => {
            const Icon = f.icon
            const isActive = activeFilter === f.label

            return (
              <Button
                key={f.label}
                size="sm"
                variant={isActive ? "default" : undefined}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-full",
                  !isActive && "bg-white/10 text-white"
                )}
                onClick={() => setActiveFilter(f.label)}
              >
                <Icon className="size-4" />
                {f.label}
              </Button>
            )
          })}
        </div>
        <Button
          variant="ghost"
          className="flex items-center gap-1 rounded-full"
        >
          <Filter className="size-4" />
          Filters
        </Button>
      </div>

      {/* restaurant cards grid */}
      <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-6 px-6 py-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-10">
        {isLoading && (
          <div className="col-span-full text-center text-slate-300">
            Loading restaurants...
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="col-span-full rounded-lg bg-red-500/10 px-4 py-3 text-center text-red-300">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && restaurants.length === 0 && (
          <div className="col-span-full text-center text-slate-300">
            No restaurants found.
          </div>
        )}

        {!isLoading &&
          !errorMessage &&
          restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} {...restaurant} />
          ))}
      </div>

      {/* partnership banner */}
      <section className="mx-auto mt-12 w-full max-w-6xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="rounded-lg bg-[#0F172B99] px-8 py-6 text-center">
          <h2 className="text-3xl font-semibold">Own a Restaurant?</h2>
          <p className="mt-2 text-slate-300">
            Join the most exclusive dining network in the country. We only
            accept the top 10% of applicants to maintain our premium standards.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-4 rounded-full bg-primary text-slate-950 hover:bg-primary/90"
          >
            <Link to="/partner-apply">Apply for Partnership</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
