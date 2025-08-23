"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { useTheme } from "next-themes";
import { Clock } from "lucide-react";

import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export const ThemeToggle = () => {
  return (
    <button className="p-2 rounded-lg">
      <SunIcon className="h-6 w-6" />
    </button>
  );
};

export default function Toolbar() {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Dynamic theme classes
  const isDark = theme === 'dark';
  const bgToolbar = isDark ? 'bg-gray-900/80' : 'bg-white/80';
  const borderColor = isDark ? 'border-gray-800/50' : 'border-gray-200/50';
  const textPrimary = isDark ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgButton = isDark ? 'bg-gray-800/50' : 'bg-gray-100/50';
  const bgButtonHover = isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200/50';
  const borderButton = isDark ? 'border-gray-700/50' : 'border-gray-300/50';

  return (
    <div className={`flex justify-between items-center w-full p-4 ${bgToolbar} backdrop-blur-xl border-b ${borderColor}`}>
      <div>
        <h2 className={`text-2xl font-bold ${textPrimary} capitalize`}>
          {pathname === '/' ? 'dashboard' : pathname.slice(1)}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 px-4 py-2 ${bgButton} ${borderButton} border rounded-xl ${textSecondary}`}>
          <Clock className="w-4 h-4" />
          <span className="font-medium">
            {currentDate.toLocaleTimeString("ru-RU", { 
              hour: "2-digit", 
              minute: "2-digit" 
            })}
          </span>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className={`h-10 w-10 ${bgButton} ${borderButton} ${bgButtonHover} transition-all duration-200 hover:shadow-lg`}
        >
          {!mounted ? (
            <SunIcon className="w-4 h-4" />
          ) : theme === "dark" ? (
            <SunIcon className="w-4 h-4" />
          ) : (
            <MoonIcon className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}