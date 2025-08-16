"use client"

import * as React from "react"
import { 
  Home, 
  ShoppingCart, 
  Utensils, 
  BarChart, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Receipt,
  LogOut
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/shared/ui/sidebar"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip"
import { useAuth } from "@/entities/auth/hooks/useAuth"

interface POSSidebarProps {
  className?: string
}

export default function POSSidebar({ className }: POSSidebarProps) {
  const { open: isOpen } = useSidebar()
  const pathname = usePathname()
  const { logout } = useAuth()
  
  const navigationItems = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Главная"
    },
    {
      href: "/orders",
      icon: Receipt,
      label: "Заказы"
    },
    {
      href: "/sales",
      icon: ShoppingCart,
      label: "Продажи"
    },
    {
      href: "/kitchen",
      icon: Utensils,
      label: "Кухня"
    },
    {
      href: "/reports",
      icon: BarChart,
      label: "Отчёты"
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Настройки"
    }
  ]

  if (pathname === "/login" || pathname === "/register") {
    return null
  }

  return (
    <TooltipProvider>
      <Sidebar 
        className={cn(
          "bg-[#1b1a1f] border-r-0 h-screen flex-shrink-0",
          "transition-all duration-300 ease-in-out",
          className
        )}
        collapsible="icon"
      >
        {/* Header */}
        <SidebarHeader className="h-16 flex items-center justify-between px-4">
          {isOpen && (
            <div>
              <h2 className="text-2xl font-bold">Pos System</h2>
            </div>
          )}
        </SidebarHeader>

        {/* Content */}
        <SidebarContent className={cn("py-4", isOpen ? "px-2" : "px-1")}>
          <SidebarMenu className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <SidebarMenuItem key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={cn(
                          "group rounded-lg transition-all duration-200 ",
                          "hover:bg-[#262626] hover:text-[#fbfbfb]",
                          isOpen ? "h-12" : "h-10 w-10",
                          isActive && "bg-[#f56f10] text-white hover:bg-[#f56f10]/90"
                        )}
                      >
                        <Link href={item.href} className="flex items-center">
                          <div className={cn(
                            "flex items-center gap-3 w-full",
                            isOpen ? "px-3" : "justify-center px-0"
                          )}>
                            <Icon className="w-5 h-5 shrink-0" />
                            {isOpen && (
                              <span className="font-medium text-sm truncate">
                                {item.label}
                              </span>
                            )}
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {!isOpen && (
                      <TooltipContent 
                        side="right" 
                        className="bg-[#262626] border-[#878787]/20 text-white"
                      >
                        <p>{item.label}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="p-4 border-t border-[#262626]">
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton
                onClick={logout}
                className={cn(
                  "group rounded-lg transition-all duration-200 w-full",
                  "hover:bg-red-600 hover:text-white",
                  isOpen ? "h-12 px-3" : "h-10 w-10 mx-auto"
                )}
              >
                <div className={cn(
                  "flex items-center gap-3 w-full",
                  isOpen ? "px-0" : "justify-center px-0"
                )}>
                  <LogOut className="w-5 h-5 shrink-0" />
                  {isOpen && (
                    <span className="font-medium text-sm truncate">
                      Выйти
                    </span>
                  )}
                </div>
              </SidebarMenuButton>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent 
                side="right" 
                className="bg-[#262626] border-[#878787]/20 text-white"
              >
                <p>Выйти из системы</p>
              </TooltipContent>
            )}
          </Tooltip>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  )
}