"use client"
import { FC } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarMenu } from "./SidebarMenu";
import { SidebarFooter } from "./SidebarFooter";
import { useSidebarStore } from "../model/sidebar";
import { cn } from "@/lib/utils";

export const Sidebar: FC = () => {
  const { isMobileOpen } = useSidebarStore();
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 w-64 bg-gray-50 flex flex-col transition-transform md:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <SidebarHeader />
      <SidebarMenu />
      <SidebarFooter />
    </div>
  );
};