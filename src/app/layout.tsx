import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import { Sidebar } from "@/features/sidebar/ui/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "POS Management Dashboard",
  description: "A management dashboard for POS systems",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 md:ml-64">{children}</main>
        </div>
      </body>
    </html>
  );
}