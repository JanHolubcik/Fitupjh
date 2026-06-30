import { capitalizeFirstLetter } from "@/app/[lng]/constants/FunctionsHelper";
import MacroProgressBar from "../MacrosProgressBarDashboard/MacrosProgressBarDashboard";
import { CardBody } from "@heroui/react";
import {
  MACRO_TAILWIND_THEME,
  MacroArray,
} from "@/app/[lng]/constants/MacrosHelper";
import { useT } from "next-i18next/client";
import { CardUniversal } from "@/components/common";
import useTodayMacros from "@/hooks/useTodayMacros";

const TodayMacros = () => {
  const { recommendedMacros, calculatedMacros } = useTodayMacros();
  const { t } = useT("dashboard");

  return (
    <CardUniversal
      id={"tour-macros"}
      className="w-full h-full sm:flex-1 flex flex-col gap-4"
    >
      <CardBody className="grid  md:grid-cols-2 grid-cols-1  gap-2">
        {MacroArray.map((macro) => (
          <MacroProgressBar
            key={macro}
            label={t(`macros.${macro}`, {
              defaultValue: capitalizeFirstLetter(macro),
            })}
            current={calculatedMacros[macro as keyof typeof calculatedMacros]}
            target={recommendedMacros[macro as keyof typeof recommendedMacros]}
            unit={
              macro === "calories" ? t("todayMacros.kcal") : t("todayMacros.g")
            }
            colorName={
              MACRO_TAILWIND_THEME[macro as keyof typeof MACRO_TAILWIND_THEME]
                .color
            }
          />
        ))}
      </CardBody>
    </CardUniversal>
  );
};

export default TodayMacros;

