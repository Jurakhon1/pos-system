"use client"

import * as React from "react"
import { 
  Settings, 
  Shield,
  CreditCard,
  ClipboardList,
  BarChart3,
  Users,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useTheme } from "next-themes"

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
  const { theme } = useTheme()
  
  // Dynamic theme classes
  const isDark = theme === 'dark'
  const bgSidebar = isDark ? 'bg-gray-900/50' : 'bg-white/90'
  const bgSidebarHover = isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
  const bgActive = isDark ? 'bg-blue-600/20' : 'bg-blue-100'
  const bgActiveHover = isDark ? 'hover:bg-blue-600/30' : 'hover:bg-blue-200'
  const bgLogoutHover = isDark ? 'hover:bg-red-600/20' : 'hover:bg-red-100'
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200'
  const textPrimary = isDark ? 'text-gray-100' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-500'
  
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
          `${bgSidebar} backdrop-blur-xl border-r ${borderColor} h-screen flex-shrink-0`,
          "transition-all duration-300 ease-in-out shadow-2xl",
          isDark ? 'shadow-black/20' : 'shadow-gray-200/50',
          className
        )}
        collapsible="icon"
      >
        {/* Header */}
        <SidebarHeader className={`h-16 flex items-center justify-between px-4 border-b ${borderColor}`}>
          {isOpen && (
            <div>
              <h2 className={`text-2xl font-bold ${textPrimary} mb-1`}>Pos System</h2>
              {userRole && (
                <p className={`text-sm ${textSecondary} capitalize`}>{userRole}</p>
              )}
            </div>
          )}
        </SidebarHeader>

        {/* Content */}
        <SidebarContent className={cn("py-4", isOpen ? "px-2" : "px-1")}>
          <SidebarMenu className="space-y-2">
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
                          "group rounded-xl transition-all duration-200",
                          "hover:shadow-lg",
                          isOpen ? "h-12" : "h-10 w-10",
                          isActive 
                            ? `${bgActive} ${isDark ? 'text-blue-400' : 'text-blue-600'} ${bgActiveHover} shadow-lg border ${isDark ? 'border-blue-500/30' : 'border-blue-200'}` 
                            : `${textSecondary} ${bgSidebarHover} hover:text-gray-100`
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
                        className={`${isDark ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'} border shadow-lg`}
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
        <SidebarFooter className={`p-4 border-t ${borderColor}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton
                onClick={logout}
                className={cn(
                  "group rounded-xl transition-all duration-200 w-full",
                  `${bgSidebarHover} ${textSecondary} hover:text-white`,
                  `${bgLogoutHover} hover:shadow-lg`,
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
                className={`${isDark ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'} border shadow-lg`}
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