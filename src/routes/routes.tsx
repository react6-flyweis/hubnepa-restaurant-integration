import { lazy } from "react"
import type { RouteObject } from "react-router"

const HomePage = lazy(() => import("@/pages/HomePage"))
const RestaurantsPage = lazy(() => import("@/pages/RestaurantsPage"))
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"))
const PartnerLoginPage = lazy(() => import("@/pages/PartnerLoginPage"))
const DashboardPage = lazy(() => import("@/pages/DashboardPage.tsx"))
const OrderManagementPage = lazy(() => import("@/pages/OrderManagementPage"))
const InventoryPage = lazy(() => import("@/pages/InventoryPage"))
const ExpensesPage = lazy(() => import("@/pages/ExpensesPage"))
const ReportsPage = lazy(() => import("@/pages/ReportsPage"))
const SalesPage = lazy(() => import("@/pages/SalesPage"))
const TeamManagementPage = lazy(() => import("@/pages/TeamManagementPage"))
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"))
const SupportPage = lazy(() => import("@/pages/SupportPage"))
const SettingsPage = lazy(() => import("@/pages/SettingsPage"))

import DashLayout from "@/components/layouts/DashLayout"
import AuthWrapper from "@/components/auth/AuthWrapper"
import { NotFound } from "@/pages/NotFoundPage"

export const Routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/restaurants",
    element: <RestaurantsPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/partner-login",
    element: <PartnerLoginPage />,
  },
  {
    path: "/dashboard",
    element: (
      <AuthWrapper>
        <DashLayout />
      </AuthWrapper>
    ), // layout will render nested pages via <Outlet />
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "orders", element: <OrderManagementPage /> },
      { path: "inventory", element: <InventoryPage /> },
      { path: "expenses", element: <ExpensesPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "sales", element: <SalesPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "support", element: <SupportPage /> },
      { path: "team", element: <TeamManagementPage /> },
      { path: "settings", element: <SettingsPage /> },

      { path: "*", element: <NotFound /> },
    ],
  },
  // global 404 (optional)
  { path: "*", element: <NotFound /> },
]
