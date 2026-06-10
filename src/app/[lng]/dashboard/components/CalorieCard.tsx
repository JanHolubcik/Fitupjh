import { useCalculateRecommendedCalories } from "@/app/[lng]/yourintake/hooks/useCalculateRecomendedCalories";
import { FoodType } from "@/types/Types";
import { Card, CardBody, CircularProgress } from "@nextui-org/react";
import { useT } from "next-i18next/client";

type props = {
  intakeToday: FoodType | null;
};
export const CalorieCard = (props: props) => {
  const { recommendedCaloriesValue, caloriesSum } =
    useCalculateRecommendedCalories(props.intakeToday);
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
    <Card className="flex items-center justify-center bg-content1 shadow-lg w-80 max-w-80">
      <CardBody className="flex justify-center items-center p-4">
        <CircularProgress
          classNames={{
            svg: "w-36 h-36 drop-shadow-md",
            value: "text-md font-bold text-white",
            label: "text-md text-white  text-center ",
          }}
          size="lg"
          value={caloriesSum}
          color={color}
          label={label}
          maxValue={recommendedCaloriesValue}
          showValueLabel={true}
        />
      </CardBody>
    </Card>
  );
};
