export interface MenuItem {
  label: string;
  icon: string;
  href: string;
  subItems?: MenuItem[];
}