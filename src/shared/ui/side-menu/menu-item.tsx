import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/shared/types/menu";
import { LucideIcon } from "lucide-react";

interface MenuItemComponentProps {
  item: MenuItem;
  isExpanded: boolean;
  isCollapsed: boolean;
  onToggle: (itemId: string) => void;
  icon?: LucideIcon;
}

export function MenuItemComponent({ 
  item, 
  isExpanded, 
  isCollapsed, 
  onToggle,
  icon: IconComponent
}: MenuItemComponentProps) {
  return (
    <li>
      <button
        onClick={() => onToggle(item.id)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-50 transition-colors",
          isExpanded && "bg-gray-50"
        )}
      >
        <div className="flex items-center gap-3">
          {IconComponent && <IconComponent className="w-5 h-5" />}
          {!isCollapsed && <span className="text-sm">{item.title}</span>}
        </div>
        {!isCollapsed && item.subItems && (
          <ChevronDown 
            className={cn(
              "w-4 h-4 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        )}
      </button>

      {/* Sub Menu */}
      {isExpanded && item.subItems && !isCollapsed && (
        <ul className="bg-gray-50">
          {item.subItems.map((subItem) => (
            <li key={subItem.id}>
              <a
                href={subItem.href}
                className={cn(
                  "block px-8 py-2 text-sm hover:bg-gray-100 transition-colors",
                  subItem.isActive && "bg-blue-50 text-blue-600 font-medium"
                )}
              >
                {subItem.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
