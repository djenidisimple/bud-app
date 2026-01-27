"use client"

import * as React from "react"
import {
  Command,
  FolderOpen,
  LayoutDashboard,
  Settings,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"

const data = {
  navMain: [
    {
      title: "Tableau de bord",
      url: "/budget/dashboard/",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Project",
      url: "/budget/transaction",
      icon: FolderOpen,
    },
    {
      title: "Paramètre",
      url: "/budget/settings",
      icon: Settings,
    },
    
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
      const { user } = useAuth()

    return (
      <Sidebar
        className="top-0 w-16 h-[calc(95svh-var(--header-height))]!"
        {...props}
      >
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
    )
}
