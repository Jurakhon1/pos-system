"use client"

import * as React from "react"
import { 
  Settings, 
  Shield,
  CreditCard,
  ClipboardList,
  BarChart3,
  Users
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
import { cn } from "@/shared/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip"
import { useAuth } from "@/entities/auth/hooks/useAuth"
import { ROLE_ACCESS, USER_ROLES } from "@/shared/types/auth"

interface POSSidebarProps {
  className?: string
}

export default function POSSidebar({ className }: POSSidebarProps) {
  const { open: isOpen } = useSidebar()
  const pathname = usePathname()
  const { logout, getCurrentUserRole, hasAccessToPage } = useAuth()
  
  const navigationItems = [
    {
      href: "/dashboard",
      label: "Главная",
      icon: Shield,
      roles: [USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN, USER_ROLES.MANAGER]
    },
    {
      href: "/pos",
      label: "POS",
      icon: CreditCard,
      roles: [USER_ROLES.CASHIER, USER_ROLES.WAITER, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN, USER_ROLES.MANAGER]
    },
    {
      href: "/orders",
      label: "Заказы",
      icon: ClipboardList,
      roles: [USER_ROLES.CASHIER, USER_ROLES.WAITER, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN, USER_ROLES.MANAGER]
    },
    {
      href: "/kitchen",
      label: "Кухня",
      icon: Shield,
      roles: [USER_ROLES.CHEF, USER_ROLES.COOK, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN, USER_ROLES.MANAGER]
    },
    {
      href: "/reports",
      label: "Отчёты",
      icon: BarChart3,
      roles: [USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN, USER_ROLES.MANAGER]
    },
    {
      href: "/settings",
      label: "Настройки",
      icon: Settings,
      roles: [USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN, USER_ROLES.MANAGER]
    },
    {
      href: "/admin",
      label: "Админ панель",
      icon: Users,
      roles: [USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN]
    }
  ]

  // Фильтруем пункты меню на основе роли пользователя
  const userRole = getCurrentUserRole();
  const accessibleNavigationItems = navigationItems.filter(item => {
    if (!userRole) return false;
    return item.roles.includes(userRole as any);
  });

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
              {userRole && (
                <p className="text-sm text-gray-400 capitalize">{userRole}</p>
              )}
            </div>
          )}
        </SidebarHeader>

        {/* Content */}
        <SidebarContent className={cn("py-4", isOpen ? "px-2" : "px-1")}>
          <SidebarMenu className="space-y-1">
            {accessibleNavigationItems.map((item) => {
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
                            <item.icon className="h-5 w-5 flex-shrink-0" />
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