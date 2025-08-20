declare module 'lucide-react' {
  import { ComponentType } from 'react';
  
  interface IconProps {
    className?: string;
    size?: number | string;
    [key: string]: any;
  }

  export const Users: ComponentType<IconProps>;
  export const Phone: ComponentType<IconProps>;
  export const ClipboardList: ComponentType<IconProps>;
  export const Table: ComponentType<IconProps>;
  export const ShoppingCart: ComponentType<IconProps>;
  export const Plus: ComponentType<IconProps>;
  export const Minus: ComponentType<IconProps>;
  export const Trash2: ComponentType<IconProps>;
  export const User: ComponentType<IconProps>;
  export const FileText: ComponentType<IconProps>;
  export const CreditCard: ComponentType<IconProps>;
  export const Search: ComponentType<IconProps>;
  export const Filter: ComponentType<IconProps>;
  export const Clock: ComponentType<IconProps>;
  export const Eye: ComponentType<IconProps>;
  export const Edit: ComponentType<IconProps>;
  export const AlertTriangle: ComponentType<IconProps>;
  export const CheckCircle: ComponentType<IconProps>;
  export const XCircle: ComponentType<IconProps>;
  export const Loader2: ComponentType<IconProps>;
  
  // Admin panel icons
  export const Settings: ComponentType<IconProps>;
  export const Package: ComponentType<IconProps>;
  export const BarChart3: ComponentType<IconProps>;
  export const Database: ComponentType<IconProps>;
  export const Shield: ComponentType<IconProps>;
  export const ArrowLeft: ComponentType<IconProps>;
  export const Image: ComponentType<IconProps>;
  export const DollarSign: ComponentType<IconProps>;
  export const Tag: ComponentType<IconProps>;
  export const Scale: ComponentType<IconProps>;
  export const Calendar: ComponentType<IconProps>;
}
