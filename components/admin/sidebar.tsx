"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, BookOpen, Database, Home, Layers, Settings, Users, Server, Bell } from "lucide-react"

const adminRoutes = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Mining Rigs",
    href: "/admin/mining-rigs",
    icon: Server,
  },
  {
    title: "Staking Pools",
    href: "/admin/staking-pools",
    icon: Layers,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Database",
    href: "/admin/db-status",
    icon: Database,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-screen bg-black/40 border-r border-white/10 fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <Link href="/admin" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-white">Admin Panel</span>
        </Link>
      </div>
      <nav className="px-4 py-2">
        <ul className="space-y-1">
          {adminRoutes.map((route) => {
            const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`)
            return (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                    isActive ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <route.icon className="h-5 w-5" />
                  <span>{route.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
