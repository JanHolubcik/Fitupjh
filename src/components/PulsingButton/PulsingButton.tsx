import { Button, ButtonProps } from "@heroui/react";
import React from "react";

type CustomButtonProps = ButtonProps & {
  className?: string;
  noPulsing?: boolean;
};

const PulsingButton: React.FC<CustomButtonProps> = ({
  className = "",
  children,
  noPulsing,
  ...props
}) => {
  const defaultStyle = `mt-6 px-4 py-2 rounded-xl font-bold text-black bg-primary-400 hover:scale-105 transition-transform ${
    noPulsing ? "" : "animate-pulse"
  }  hover:opacity-100 hover:bg-primary-600`;

  return (
    <Button className={`${defaultStyle} ${className}`} {...props}>
      {children}
    </Button>
  );
};

export default PulsingButton;
