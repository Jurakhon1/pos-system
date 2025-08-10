"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className, ...props }: DivProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 text-gray-900 w-64 transition-[width,transform] duration-300 lg:translate-x-0 -translate-x-full",
        className
      )}
      {...props}
    />
  );
}

export function SidebarHeader({ className, ...props }: DivProps) {
  return (
    <div className={cn("h-16 px-4 flex items-center justify-between border-b border-gray-200", className)} {...props} />
  );
}

export function SidebarContent({ className, ...props }: DivProps) {
  return <div className={cn("flex-1 overflow-y-auto py-2", className)} {...props} />;
}

export function SidebarFooter({ className, ...props }: DivProps) {
  return <div className={cn("border-t border-gray-200 p-4", className)} {...props} />;
}

export function SidebarGroup({ className, ...props }: DivProps) {
  return <div className={cn("mb-2", className)} {...props} />;
}

export function SidebarGroupLabel({ className, ...props }: DivProps) {
  return <div className={cn("px-4 py-2 text-xs font-semibold text-gray-500 uppercase", className)} {...props} />;
}

export function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("space-y-1", className)} {...props} />;
}

export function SidebarMenuItem({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li className={cn(className)} {...props} />;
}

export function SidebarMenuButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-50 transition-colors",
        className
      )}
      {...props}
    />
  );
}
