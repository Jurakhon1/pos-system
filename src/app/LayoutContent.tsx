"use client";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense, lazy } from "react";
import { Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";

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
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={
      <div className="flex h-screen w-full">
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
        <div className="flex h-screen w-full">
          <POSSidebar />

          <SidebarInset className="flex-1 overflow-auto bg-background min-w-0">
            <div className="flex items-center gap-2 p-5 shadow-md shadow-border border-b border-border">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarTrigger className="h-8 w-8 p-1 hover:bg-muted hover:text-primary rounded-md transition-colors duration-200 border border-border">
                      <Settings className="h-4 w-4" />
                    </SidebarTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Переключить сайдбар</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Toolbar />
            </div>
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
