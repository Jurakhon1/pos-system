"use client";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense, lazy } from "react";
import { Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { useTheme } from "next-themes";

// Динамические импорты для тяжелых компонентов
const POSSidebar = dynamic(() => import("@/widgets/sidebar/POSSidebar"), {
  ssr: false,
  loading: () => (
    <div className="w-64 bg-background border-r border-border animate-pulse">
      <div className="h-16 bg-muted rounded-none" />
      <div className="space-y-2 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 bg-muted rounded" />
        ))}
      </div>
    </div>
  ),
});

const SidebarProvider = dynamic(
  () => import("@/shared/ui/sidebar").then(mod => ({ default: mod.SidebarProvider })),
  { ssr: false }
);

const SidebarInset = dynamic(
  () => import("@/shared/ui/sidebar").then(mod => ({ default: mod.SidebarInset })),
  { ssr: false }
);

const SidebarTrigger = dynamic(
  () => import("@/shared/ui/sidebar").then(mod => ({ default: mod.SidebarTrigger })),
  { ssr: false }
);

const Toolbar = dynamic(() => import("@/widgets/toolbar/toolbar"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 h-8 bg-muted rounded animate-pulse" />
  ),
});

// Компонент для условного рендеринга
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  // Dynamic theme classes
  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-gray-950' : 'bg-gray-50';
  const bgContent = isDark ? 'bg-gray-950/50' : 'bg-white/50';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={
      <div className={`flex h-screen w-full ${bgMain}`}>
        <div className="w-64 bg-background border-r border-border animate-pulse">
          <div className="h-16 bg-muted rounded-none" />
        </div>
        <div className="flex-1">
          <div className="h-16 bg-muted border-b border-border animate-pulse" />
          <main className="p-4">
            <div className="h-8 bg-muted rounded animate-pulse mb-4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded" />
              ))}
            </div>
          </main>
        </div>
      </div>
    }>
      <SidebarProvider defaultOpen={true}>
        <div className={`flex h-screen w-full ${bgMain}`}>
          <POSSidebar />

          <SidebarInset className={`flex-1 overflow-auto ${bgContent} min-w-0`}>
            <Toolbar />
            <main className="flex-1">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </Suspense>
  );
}

export default LayoutContent;
