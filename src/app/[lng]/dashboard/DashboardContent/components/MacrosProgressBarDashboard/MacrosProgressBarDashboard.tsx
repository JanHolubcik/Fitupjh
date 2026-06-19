import React from "react";
import { Progress } from "@heroui/react";
import { useIsMd } from "@/app/[lng]/constants/FunctionsHelper";

type props = {
  label: string;
  current: number;
  target: number;
  unit?: string;
  colorName?: string;
};

const MacroProgressBar = ({
  label,
  current,
  target,
  unit = "g",
  colorName = "primary",
}: props) => {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  const isMd = useIsMd();
  return (
    <div className="w-full p-1 ">
      <Progress
        label={label}
        value={percentage}
        size={isMd ? "md" : "sm"}
        radius="full"
        showValueLabel={true}
        classNames={{
          value: "text-[14px] w-25 self-end text-end whitespace-nowrap",
          label: "text-md  whitespace-nowrap overflow-hidden text-ellipsis",
          indicator: colorName,
        }}
        className="self-end"
        valueLabel={
          <span>
            {Math.round(current)} / {Math.round(target)}
            <span className="text-xs w-16 text-foreground-400 ml-0.5">
              {unit}
            </span>
          </span>
        }
      />
    </div>
  );
};

export default MacroProgressBar;

