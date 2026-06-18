import { useCalculateRecommendedCalories } from "@/hooks/useCalculateRecomendedCalories";
import { CardUniversal } from "@/components/common";

import { CardBody, CircularProgress } from "@nextui-org/react";
import { useT } from "next-i18next/client";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { useActivityOperations } from "@/hooks/useActivityOperations";

export const CalorieCard = () => {
  const { savedFood } = useYourIntakeOperations();
  const { savedActivities } = useActivityOperations();
  const { recommendedCaloriesValue, caloriesSum } =
    useCalculateRecommendedCalories(savedFood, savedActivities);
  const { t } = useT("dashboard");

  const color = caloriesSum > recommendedCaloriesValue ? "danger" : "success";

  const diff = Math.abs(recommendedCaloriesValue - caloriesSum).toFixed(0);

  let label = t("calorieCard.kcalRemaining", { amount: diff });
  if (caloriesSum === 0) {
    label = t("calorieCard.noRecords");
  } else if (caloriesSum > recommendedCaloriesValue) {
    label = t("calorieCard.kcalOver", { amount: diff });
  }

  return (
    <CardUniversal
      id={"tour-calories"}
      className="flex h-auto items-center justify-center  "
    >
      <CardBody className="flex justify-center items-center ">
        <CircularProgress
          classNames={{
            svg: "w-36 h-36 drop-shadow-md",
            value: "text-md font-bold ",
            label: "text-md   text-center ",
          }}
          size="lg"
          value={caloriesSum}
          color={color}
          label={label}
          maxValue={recommendedCaloriesValue}
          showValueLabel={true}
        />
      </CardBody>
    </CardUniversal>
  );
};
