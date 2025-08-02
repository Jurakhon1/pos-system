import { FC } from "react";
import * as Lucide from "lucide-react";
import { LucideProps } from "lucide-react";

interface IconProps extends LucideProps {
  name: keyof typeof Lucide;
}

export const Icon: FC<IconProps> = ({ name, className, ...props }) => {
  const IconComponent = Lucide[name] as FC<LucideProps>;
  if (!IconComponent) return null;
  return <IconComponent className={className} {...props} />;
};