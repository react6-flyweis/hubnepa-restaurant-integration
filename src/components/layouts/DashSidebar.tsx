import { NavLink, useNavigate } from "react-router"
import {
  ChefHat,
  Wallet,
  BarChart2,
  DollarSign,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  X,
  HomeIcon,
  LayoutDashboard,
  ClipboardList,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { logout } from "@/lib/auth-api"

export default function DashSidebar() {
  const { toggleSidebar } = useSidebar()
  const navigate = useNavigate()

  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard", end: true },
    { label: "Order Management", icon: ClipboardList, to: "/dashboard/orders" },
    { label: "Inventory & Recipes", icon: ChefHat, to: "/dashboard/inventory" },
    { label: "Expenses", icon: Wallet, to: "/dashboard/expenses" },
    { label: "Reports & Analytics", icon: BarChart2, to: "/dashboard/reports" },
    { label: "Sales & Closing", icon: DollarSign, to: "/dashboard/sales" },
    { label: "Team Management", icon: Users, to: "/dashboard/team" },
    { label: "Support & Help", icon: MessageSquare, to: "/dashboard/support" },
    { label: "Settings", icon: Settings, to: "/dashboard/settings" },
  ]

  async function handleLogout() {
    await logout()
    navigate("/partner-login", { replace: true })
  }

  return (
    <Sidebar className="bg-white text-gray-800">
      <SidebarHeader className="flex flex-row items-center justify-between border-b py-5">
        <div className="flex items-center gap-2">
          <HomeIcon className="h-6 w-6 text-green-600" />
          <span className="text-lg font-semibold">Restaurant Panel</span>
        </div>
        <button onClick={toggleSidebar} aria-label="Close sidebar">
          <X className="h-4 w-4" />
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {menu.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <NavLink to={item.to} className="w-full" end={item.end}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        isActive={isActive}
                        className="h-10 capitalize"
                      >
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <button
              className="flex w-full items-center gap-2 px-2 py-1 text-red-600 hover:bg-red-100"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
