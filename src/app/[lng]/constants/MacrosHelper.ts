export type MacroType =
  | "calories"
  | "protein"
  | "carbohydrates"
  | "fat"
  | "sugar"
  | "fiber";

type ThemeStyles = {
  text: string;
  color: string;
  bg: string;
  border: string;
};

export const MACRO_TAILWIND_THEME: Record<MacroType, ThemeStyles> = {
  calories: {
    text: "text-orange-500",
    color: "bg-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-600",
  },
  protein: {
    text: "text-blue-500",
    color: "bg-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-600",
  },
  carbohydrates: {
    text: "text-amber-500",
    color: "bg-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-600",
  },
  fat: {
    text: "text-violet-500",
    color: "bg-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-600",
  },
  sugar: {
    text: "text-pink-600",
    color: "bg-pink-500",
    bg: "bg-pink-500/10",
    border: "border-pink-600",
  },
  fiber: {
    text: "text-emerald-500",
    color: "bg-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-600",
  },
};

export const MacroArray: MacroType[] = [
  "calories",
  "protein",
  "carbohydrates",
  "fat",
  "sugar",
  "fiber",
];

export const getMacroInfo = (
  macroType: MacroType,
  value: number | undefined,
) => {
  const shortLabel = macroType.charAt(0);
  const fullLabel = macroType;
  return {
    label: shortLabel,
    fullLabel,
    value: value || 0,
    ...MACRO_TAILWIND_THEME[macroType],
  };
};
