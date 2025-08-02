import { FC } from "react";
import { Icon } from "@/shared/ui/Icon";
import { menuItems } from "@/shared/constants/menu-items";
import { useSidebarStore } from "../model/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";

export const SidebarMenu: FC = () => {
    const { activeSubMenu, setActiveSubMenu } = useSidebarStore();

    return (
        <ul className="flex-1 overflow-y-auto p-2">
            {menuItems.map((item) => (
                <li key={item.label} className={cn(activeSubMenu === item.label && "bg-gray-100")}>
                    <Button
                        variant="ghost"
                        className="w-full flex justify-between items-center"
                        onClick={() => setActiveSubMenu(activeSubMenu === item.label ? null : item.label)}
                    >

                        <div className="flex items-center">
                            <Icon name="Menu" className="h-6 w-6" />
                            <span>{item.label}</span>
                        </div>
                        {item.subItems && <Icon name="ChevronDown" className="h-4 w-4" />}
                    </Button>
                    {item.subItems && activeSubMenu === item.label && (
                        <ul className="pl-6">
                            {item.subItems.map((subItem) => (
                                <li key={subItem.label}>
                                    <Link href={subItem.href} className="block py-2 text-sm text-gray-600 hover:bg-gray-50">
                                        {subItem.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
};