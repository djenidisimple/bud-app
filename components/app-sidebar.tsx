'use client'

import {
  GalleryVerticalEnd,
  LayoutDashboard,
  Settings2,
  Wallet,
  Search,
  Sparkles,
  ChevronLeft,
  Plus,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarInput,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Tableau de bord",
      url: "/budget/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Projets",
      url: "/budget/transaction",
      icon: Wallet,
    },
    {
      title: "Paramètres",
      url: "/budget/settings",
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, setOpen } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-gray-200">
      <div className="flex h-full w-full bg-white">
        {/* Narrow Rail */}
        <div className="flex flex-col items-center py-6 gap-6 w-[72px] border-r border-gray-100 shrink-0 bg-gray-50/50">
          {/* Brand Icon */}
          <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md cursor-pointer hover:scale-105 transition-transform">
            <GalleryVerticalEnd className="size-5" />
          </div>

          <div className="flex flex-col gap-4">
            <SidebarMenuButton size="sm" className="!size-10 !p-0 justify-center hover:bg-white rounded-lg shadow-sm transition-all">
              <Search className="size-5 text-gray-500" />
            </SidebarMenuButton>
          </div>

          <div className="w-8 h-px bg-gray-200" />

          <div className="flex flex-col gap-4">
            {data.navMain.map((item) => (
              <SidebarMenuButton 
                key={item.title} 
                asChild
                size="sm" 
                className="!size-10 !p-0 justify-center hover:bg-white rounded-lg shadow-sm transition-all"
              >
                <Link href={item.url}>
                  <item.icon className="size-5 text-gray-500" />
                </Link>
              </SidebarMenuButton>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-4 pb-4">
            <SidebarMenuButton size="sm" className="!size-10 !p-0 justify-center text-indigo-600 hover:bg-white rounded-lg shadow-sm transition-all">
              <Sparkles className="size-5" />
            </SidebarMenuButton>
            <div className="flex flex-col gap-4">
               <SidebarMenuButton size="sm" className="!size-10 !p-0 justify-center hover:bg-white rounded-lg shadow-sm transition-all">
                <Settings2 className="size-5 text-gray-500" />
              </SidebarMenuButton>
            </div>
            <div className="size-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden hover:ring-2 ring-primary/20 transition-all cursor-pointer">
               <img src="https://github.com/shadcn.png" alt="user" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Expanded Panel */}
        <div 
          className={cn(
            "flex flex-col h-full w-[300px] transition-all duration-300 ease-in-out",
            !open && "hidden"
          )}
        >
          <SidebarHeader className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <span className="font-bold text-xl tracking-tight text-black">BudApp</span>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <ChevronLeft className="size-5" />
              </button>
            </div>
            
            <SidebarInput 
              placeholder="Quick search..." 
              className="h-10 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all shadow-none ring-1 ring-gray-200 focus:ring-primary" 
            />
          </SidebarHeader>

          <SidebarContent className="px-6 overflow-y-auto">
            <div className="mb-6">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-3 mb-3 block">Menu</span>
              <NavMain items={data.navMain} />
            </div>

            {/* Upgrade Card */}
            <div className="mt-8 p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 relative overflow-hidden">
              <div className="relative z-10">
                <div className="size-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
                  <Sparkles className="size-5 text-indigo-600" />
                </div>
                <div className="text-[11px] font-semibold text-indigo-400 uppercase mb-1">Current plan:</div>
                <h4 className="font-bold text-black text-sm mb-2">Pro trial</h4>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  Upgrade to Pro to get the latest and exclusive features
                </p>
                <button className="w-full py-2 px-4 bg-white text-indigo-600 text-xs font-bold rounded-lg shadow-sm hover:shadow-md border border-indigo-100 transition-all flex items-center justify-center gap-2 group">
                  <Plus className="size-3 group-hover:rotate-90 transition-transform" />
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </SidebarContent>

          <SidebarFooter className="p-6 mt-auto border-t border-gray-100">
            <div className="space-y-1 mb-6">
              <SidebarMenuButton asChild className="h-10 rounded-lg px-3 hover:bg-gray-100 text-gray-600 text-sm transition-all">
                <Link href="/budget/settings" className="flex items-center gap-3">
                  <Settings2 className="size-4" />
                  <span>Préférences</span>
                </Link>
              </SidebarMenuButton>
            </div>
            <NavUser />
          </SidebarFooter>
        </div>
      </div>
      <SidebarRail />
    </Sidebar>
  )
}

