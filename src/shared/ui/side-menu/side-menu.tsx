"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  User,
  Terminal,
  BarChart3,
  DollarSign,
  Utensils,
  Warehouse,
  Users,
  Shield,
  Package,
  Settings,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MENU_ITEMS } from "@/shared/constants/menu-items";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { UserInfo } from "@/components/ui/user-info";

interface SideMenuProps {
  className?: string;
}

const menuIcons: Record<string, LucideIcon> = {
  stats: BarChart3,
  finance: DollarSign,
  menu: Utensils,
  warehouse: Warehouse,
  marketing: Users,
  access: Shield,
  applications: Package,
  settings: Settings,
};

export function SideMenu({ className }: SideMenuProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const isHrefActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const itemHasActiveSub = (itemId: string) => {
    const item = MENU_ITEMS.find((i) => i.id === itemId);
    if (!item) return false;
    return (item.subItems ?? []).some((s) => isHrefActive(s.href));
  };

  useEffect(() => {
    // Ensure the section that contains the active route is expanded
    const withActive = MENU_ITEMS.filter((i) => (i.subItems ?? []).some((s) => isHrefActive(s.href)))
      .map((i) => i.id);
    setExpandedItems((prev) => Array.from(new Set([...
      prev.filter((p) => withActive.includes(p)),
      ...withActive,
    ])));
  }, [pathname]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      <Sidebar
        className={cn(
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 hover:bg-gray-100 rounded">
              {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </button>
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden p-1 hover:bg-gray-100 rounded">
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cover bg-center rounded" style={{ backgroundImage: 'url("/upload/pos_cdb_311928/1677442459020.png")' }} />
              <span className="font-semibold text-sm">POS System</span>
            </div>
          )}

          {!isCollapsed && (
            <a
              href="https://akram.joinposter.com/pos"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-gray-100 rounded"
              title="Открыть веб-версию кассы"
            >
              <Terminal className="w-4 h-4" />
            </a>
          )}
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {MENU_ITEMS.map((item) => {
              const Icon = menuIcons[item.id];
              const hasActive = (item.subItems ?? []).some((s) => isHrefActive(s.href));
              const isOpen = expandedItems.includes(item.id) || hasActive;

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => toggleExpanded(item.id)}
                    className={cn(isOpen && "bg-gray-50", hasActive && !isCollapsed && "text-blue-600")}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className={cn("w-5 h-5", hasActive && !isCollapsed && "text-blue-600")} />}
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </div>
                    {!isCollapsed && item.subItems && (
                      <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />)
                    }
                  </SidebarMenuButton>

                  {isOpen && item.subItems && !isCollapsed && (
                    <ul className="bg-gray-50">
                      {item.subItems.map((sub) => {
                        const active = isHrefActive(sub.href);
                        return (
                          <li key={sub.id}>
                            <Link
                              href={sub.href}
                              className={cn(
                                "block px-8 py-2 text-sm hover:bg-gray-100 transition-colors",
                                active && "bg-blue-50 text-blue-600 font-medium"
                              )}
                            >
                              {sub.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <UserInfo />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
