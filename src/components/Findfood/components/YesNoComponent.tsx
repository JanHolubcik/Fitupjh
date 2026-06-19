import { Button } from "@heroui/react";

type YesNoToggleProps = {
  yesVariant?:
    | "flat"
    | "solid"
    | "bordered"
    | "light"
    | "faded"
    | "shadow"
    | "ghost";
  noVariant?:
    | "flat"
    | "solid"
    | "bordered"
    | "light"
    | "faded"
    | "shadow"
    | "ghost";
  yesPress?: () => void;
  noPress?: () => void;
  yesLabel?: string;
  noLabel?: string;
  isDisabled?: boolean;
  size?: "sm" | "md" | "lg";
};

const YesNoToggle = ({
  yesPress,
  noPress,
  yesLabel = "Yes",
  noLabel = "No",
  size = "sm",
  noVariant = "flat",
  yesVariant = "flat",
}: YesNoToggleProps) => {
  return (
    <div className="flex gap-2">
      <Button
        size={size}
        color={"default"}
        className={"text-white font-medium"}
        variant={yesVariant}
        onPress={yesPress}
      >
        {yesLabel}
      </Button>
      <Button
        size={size}
        color={"default"}
        className={"text-white font-medium"}
        variant={noVariant}
        onPress={noPress}
      >
        {noLabel}
      </Button>
    </div>
  );
};

export default YesNoToggle;

