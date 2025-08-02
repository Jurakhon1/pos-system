import { FC } from "react";
import { Icon } from "@/shared/ui/Icon";
import { Button } from "@/shared/ui/button";

export const SidebarFooter: FC = () => {
  return (
    <div className="p-4 bg-white border-t">
      <Button variant="ghost" className="w-full flex items-center">
        <Icon name="User" className="h-5 w-5 mr-2" />
        <span>Shef</span>
        <Icon name="ChevronDown" className="h-4 w-4 ml-auto" />
      </Button>
    </div>
  );
};