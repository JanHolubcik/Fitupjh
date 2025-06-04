import { Button, ButtonProps } from "@nextui-org/react";
import React from "react";

interface CustomButtonProps extends ButtonProps {
  className?: string;
  noPulsing?: boolean;
}

const PulsingButton: React.FC<CustomButtonProps> = ({
  className = "",
  children,
  noPulsing,
  ...props
}) => {
  const defaultStyle = `mt-6 px-4 py-2 rounded-xl font-bold text-black bg-[#00FFAA] hover:scale-105 transition-transform ${
    noPulsing ? "" : "animate-pulse"
  }  hover:opacity-100 hover:bg-[#00FFAA]`;

  return (
    <Button className={`${defaultStyle} ${className}`} {...props}>
      {children}
    </Button>
  );
};

export default PulsingButton;
