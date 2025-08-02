import { create } from "zustand";

interface SidebarState {
  isMobileOpen: boolean;
  activeSubMenu: string | null;
  toggleMobile: () => void;
  setActiveSubMenu: (label: string | null) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isMobileOpen: false,
  activeSubMenu: "Statistics", // Default active menu
  toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  setActiveSubMenu: (label) => set({ activeSubMenu: label }),
}));