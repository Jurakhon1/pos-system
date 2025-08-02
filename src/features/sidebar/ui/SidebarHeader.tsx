import { FC } from "react";
import { Icon } from "@/shared/ui/Icon";
import { Button } from "@/shared/ui/button";
import { useSidebarStore } from "../model/sidebar";
import Image from "next/image";
import Link from "next/link";

export const SidebarHeader: FC = () => {
  const { toggleMobile } = useSidebarStore();
  return (
    <div className="flex items-center p-4 bg-white border-b">
      <Button variant="ghost" size="icon" onClick={toggleMobile} className="mr-2 md:hidden">
        <Icon name="Menu" className="h-6 w-6" />
      </Button>
      <Link href="/manage/dash/stat/1-7-2025/1-8-2025">
        <Image src="/logo.png" alt="Logo" width={100} height={40} />
      </Link>
      <Link href="https://akram.joinposter.com/pos" target="_blank" className="ml-auto">
        <Button variant="ghost" size="icon" title="Open POS">
          <Icon name="Monitor" className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
};