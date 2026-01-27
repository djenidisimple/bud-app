"use client"

import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Tooltip key={item.title} delayDuration={100}>
            <TooltipTrigger asChild>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  variant={"outline"} 
                  className="
                    w-auto h-auto p-2 my-2
                    relative group
                    bg-gray-50 dark:bg-gray-800
                  "
                >
                  <a href={item.url} className="block w-full h-full">
                    <item.icon 
                        size={24}
                    />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </TooltipTrigger>
            <TooltipContent 
              side="right" 
              sideOffset={10} 
              align="center"
              className="bg-gray-800 dark:bg-black text-white px-3 py-1.5 text-sm rounded-md shadow-lg"
            >
              <p>{item.title}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
