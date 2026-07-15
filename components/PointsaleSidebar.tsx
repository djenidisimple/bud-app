'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Wallet, 
  Settings2, 
  User, 
  Bell, 
  Palette, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Menu
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

const menuItems = [
  { title: 'Dashboard', url: '/budget/dashboard', icon: LayoutDashboard },
  { title: 'Transaction', url: '/budget/transaction', icon: Wallet },
  { title: 'Réglages', url: '/budget/settings', icon: Settings2 },
]

const prefItems = [
  { title: 'Themes', url: '#', icon: Palette },
  { title: 'Help', url: '#', icon: HelpCircle },
]

export function PointsaleSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const userName = user?.name || 'Utilisateur'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <>
      {/* Mobile Trigger - Only visible when collapsed on small screens */}
      <button 
        onClick={() => setCollapsed(false)}
        className={cn(
          "fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-[#e6e7eb] text-[#6b7078] shadow-sm md:hidden transition-all",
          !collapsed && "opacity-0 pointer-events-none"
        )}
      >
        <Menu className="size-5" />
      </button>

      <div 
        className={cn(
          "h-screen bg-white border-r border-[#e6e7eb] flex flex-col transition-all duration-300 ease-in-out shrink-0 z-40",
          collapsed 
            ? "w-0 md:w-[72px] border-r-0 md:border-r overflow-hidden" 
            : "w-[280px]"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex gap-3 p-4 border-b border-[#e6e7eb] min-w-[280px] md:min-w-0",
          collapsed ? "md:flex-col md:items-center md:px-0" : "items-center"
        )}>
          <div className="w-8 h-8 rounded-lg bg-[#eef0fd] flex items-center justify-center text-[#4f5bd5] shrink-0">
            <Layers className="size-5" />
          </div>
          {!collapsed && (
            <>
              <span className="font-bold text-sm truncate flex-1 text-[#1f2229]">Pointsale</span>
              <button 
                onClick={() => setCollapsed(true)}
                className="w-7 h-7 rounded-md border border-[#e6e7eb] flex items-center justify-center text-[#6b7078] hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
            </>
          )}
          {collapsed && (
            <button 
              onClick={() => setCollapsed(false)}
              className="hidden md:flex w-7 h-7 rounded-md border border-[#e6e7eb] items-center justify-center text-[#6b7078] hover:bg-gray-50 transition-colors mt-2"
            >
              <ChevronRight className="size-4" />
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className={cn(
          "p-3 border-b border-[#e6e7eb] min-w-[280px] md:min-w-0",
          collapsed && "md:flex md:justify-center"
        )}>
          <Link 
            href="#" 
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl text-[#6b7078] hover:bg-gray-50 transition-colors w-full",
              collapsed && "md:justify-center"
            )}
          >
            <Bell className="size-5 shrink-0" />
            {!collapsed && (
              <>
                <span className="text-sm font-medium text-[#1f2229] flex-1">Notifications</span>
                <span className="text-xs text-[#9498a0] font-medium">15+</span>
              </>
            )}
          </Link>
        </div>

        {/* Menu Section */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6 min-w-[280px] md:min-w-0">
          <div>
            {!collapsed && <span className="text-[11px] font-bold text-[#9498a0] uppercase tracking-wider px-3 mb-2 block">Menu</span>}
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <Link 
                    key={item.title} 
                    href={item.url}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-xl transition-all w-full",
                      isActive 
                        ? "bg-white border border-[#e3e4e8] text-[#1f2229] shadow-sm" 
                        : "text-[#6b7078] hover:bg-gray-50",
                      collapsed && "md:justify-center"
                    )}
                  >
                    <item.icon className={cn("size-5 shrink-0", isActive ? "text-[#1f2229]" : "text-[#6b7078]")} />
                    {!collapsed && <span className={cn("text-sm font-medium flex-1", isActive && "font-bold")}>{item.title}</span>}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Preferences Section */}
          <div>
            {!collapsed && <span className="text-[11px] font-bold text-[#9498a0] uppercase tracking-wider px-3 mb-2 block">Preferences</span>}
          <div className="space-y-1">
            {prefItems.map((item) => (
              <Link 
                key={item.title} 
                href={item.url}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-xl text-[#6b7078] hover:bg-gray-50 transition-all w-full",
                  collapsed && "md:justify-center"
                )}
              >
                <item.icon className="size-5 shrink-0" />
                {!collapsed && <span className="text-sm font-medium flex-1">{item.title}</span>}
              </Link>
            ))}
          </div>
          </div>
        </div>

        {/* Footer */}
        <div className={cn(
          "p-4 border-t border-[#e6e7eb] flex items-center gap-3 min-w-[280px] md:min-w-0",
          collapsed && "md:justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-[#eef0fd] text-[#4f5bd5] flex items-center justify-center font-bold text-xs shrink-0 border-2 border-white shadow-sm">
            {userInitial}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-[#1f2229]">{userName}</p>
              <p className="text-xs text-[#9498a0] truncate">Utilisateur</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
