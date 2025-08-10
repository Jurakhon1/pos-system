import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SideMenu } from "@/shared/ui/side-menu/side-menu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "POS System",
  description: "Point of Sale Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <div className="flex h-screen">
            <SideMenu />
            <main className="flex-1 ml-64 lg:ml-64">
              {children}
            </main>
          </div>
      </body>
    </html>
  );
}
