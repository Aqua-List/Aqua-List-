"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, BarChartIcon as ChartBarIcon, FileText, Home, Settings, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "My Bots",
      href: "/dashboard/bots",
      icon: Bot,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: ChartBarIcon,
    },
    {
      title: "API Keys",
      href: "/dashboard/api-keys",
      icon: FileText,
    },
    {
      title: "Team",
      href: "/dashboard/team",
      icon: Users,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <nav className="hidden w-[220px] flex-col md:flex lg:w-[240px]">
      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn("w-full justify-start", pathname === item.href && "bg-muted font-medium")}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  )
}

