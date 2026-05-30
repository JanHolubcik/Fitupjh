import React from "react";
import { Progress } from "@nextui-org/progress";

type props = {
  label: string;
  current: number;
  target: number;
  unit?: string;
  colorName?:
    | "success"
    | "warning"
    | "danger"
    | "primary"
    | "secondary"
    | "default";
};

export const MacroProgressBar = ({
  label,
  current,
  target,
  unit = "g",
  colorName = "primary",
}: props) => {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const isOverTarget = current > target && target > 0;

  return (
    <div className="w-full p-1 ">
      <Progress
        label={label}
        value={percentage}
        color={isOverTarget ? "danger" : colorName}
        size="md"
        radius="full"
        showValueLabel={true}
        valueLabel={
          <span>
            {Math.round(current)} / {Math.round(target)}
            <span className="text-xs text-foreground-400 ml-0.5">{unit}</span>
          </span>
        }
      />
    </div>
  );
};
