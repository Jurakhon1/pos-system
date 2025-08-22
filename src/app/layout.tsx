
import "./globals.css";
import QueryProvider from "@/shared/providers/QueryProvider";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import LayoutContent from "./LayoutContent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>POS Система</title>
        <meta name="description" content="Система управления точкой продаж" />
      </head>
      <body className="antialiased bg-background text-foreground" suppressHydrationWarning>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <LayoutContent>
              {children}
            </LayoutContent>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}