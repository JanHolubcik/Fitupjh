import { useCalculateRecommendedCalories } from "@/app/yourintake/hooks/useCalculateRecomendedCalories";
import { FoodType } from "@/types/Types";
import { Card, CardBody, CircularProgress } from "@nextui-org/react";

type props = {
  intakeToday: FoodType | null;
};
export const CalorieCard = (props: props) => {
  const { recommendedCaloriesValue, caloriesSum } =
    useCalculateRecommendedCalories(props.intakeToday);

  const color = caloriesSum > recommendedCaloriesValue ? "warning" : "danger";
  return (
    <Card>
      <CardBody>
        <CircularProgress
          classNames={{
            svg: "w-24 h-24 drop-shadow-md mr-4 ml-4",
            indicator: "stroke-white",
            track: "stroke-white/10",
            value: "text-md font-semibold text-white",
            label: "text-xs",
          }}
          size="lg"
          value={caloriesSum}
          color={color}
          label={caloriesSum + "/" + recommendedCaloriesValue + " Kcal"}
          maxValue={recommendedCaloriesValue}
          showValueLabel={true}
        />
      </CardBody>
    </Card>
  );
};
