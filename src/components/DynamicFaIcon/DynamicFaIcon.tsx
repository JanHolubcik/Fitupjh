// DynamicFaIcon.tsx (or add directly to your file)
import React from "react";
import * as FaIcons from "react-icons/fa";

type DynamicFaIconProps = {
  name: string | undefined;
  className?: string;
  size?: number;
};

const DynamicFaIcon = ({
  name,
  className,
  size = 20,
}: DynamicFaIconProps) => {
  if (!name) return <FaIcons.FaFire className={className} size={size} />;

  const IconComponent = FaIcons[name as keyof typeof FaIcons];

  if (!IconComponent)
    return <FaIcons.FaFire className={className} size={size} />;

  return <IconComponent className={className} size={size} />;
};

export default DynamicFaIcon;

