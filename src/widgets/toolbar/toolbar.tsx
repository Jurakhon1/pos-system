"use client";

import { Clock, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { useTheme } from "next-themes";

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

  return (
    <div className="flex justify-between items-center w-full">
      <div>
        <h2 className="text-2xl font-bold uppercase">{pathname.slice(1)}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <Clock size={16} className="mr-2" />
          <p>{currentDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8"
        >
          {!mounted ? (
            <Moon size={16} />
          ) : theme === "dark" ? (
            <Sun size={16} />
          ) : (
            <Moon size={16} />
          )}
        </Button>
      </div>
    </div>
  );
}