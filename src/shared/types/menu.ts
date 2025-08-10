export interface MenuItem {
  id: string;
  title: string;
  href?: string;
  subItems?: SubMenuItem[];
}

export interface SubMenuItem {
  id: string;
  title: string;
  href: string;
  isActive?: boolean;
}

export interface SideMenuProps {
  className?: string;
}
