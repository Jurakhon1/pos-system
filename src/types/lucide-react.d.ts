declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
  }

  export const Users: ComponentType<IconProps>;
  export const Phone: ComponentType<IconProps>;
  export const ClipboardList: ComponentType<IconProps>;
  export const ShoppingCart: ComponentType<IconProps>;
  export const Plus: ComponentType<IconProps>;
  export const Minus: ComponentType<IconProps>;
  export const Trash2: ComponentType<IconProps>;
  export const User: ComponentType<IconProps>;
  export const FileText: ComponentType<IconProps>;
  export const CreditCard: ComponentType<IconProps>;
  export const Table: ComponentType<IconProps>;
  export const Search: ComponentType<IconProps>;
  export const Filter: ComponentType<IconProps>;
  export const Clock: ComponentType<IconProps>;
  export const Eye: ComponentType<IconProps>;
  export const Edit: ComponentType<IconProps>;
}
