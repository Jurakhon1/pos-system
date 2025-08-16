import POSSidebar from "@/widgets/sidebar/POSSidebar";
import "./globals.css";
import QueryProvider from "@/shared/providers/QueryProvider";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/shared/ui/sidebar";
import Toolbar from "@/widgets/toolbar/toolbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>POS Система</title>
        <meta name="description" content="Система управления точкой продаж" />
      </head>
      <body className="antialiased bg-[#fbfbfb]">
        <QueryProvider>
          <SidebarProvider defaultOpen={true}>
            <div className="flex h-screen w-full">
              <POSSidebar />
              <SidebarInset className="flex-1 overflow-auto bg-[#fbfbfb] min-w-0">
                <div className="flex items-center gap-2 p-5 shadow-md shadow-gray-300 border-b">
                  <SidebarTrigger className="h-8 w-8" />
                  <Toolbar />
                </div>
                <main className="flex-1">
                  {children}
                </main>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </QueryProvider>
      </body>
    </html>
  );
}