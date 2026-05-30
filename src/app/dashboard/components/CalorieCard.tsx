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
    <Card className="w-56 h-56 flex items-center justify-center bg-content1 shadow-lg">
      <CardBody className="flex justify-center items-center p-0 gap-2">
        <p>Todays intake</p>
        <CircularProgress
          classNames={{
            svg: "w-36 h-36 drop-shadow-md",
            indicator: "stroke-white",
            track: "stroke-white/10",
            value: "text-md font-bold text-white",
            label: "text-sm text-white",
          }}
          size="lg" // 5. Upgraded NextUI base size to 'lg'
          value={caloriesSum}
          color={color}
          label={` ${recommendedCaloriesValue - caloriesSum} Kcal remaining`}
          maxValue={recommendedCaloriesValue}
          showValueLabel={true}
        />
      </CardBody>
    </Card>
  );
};
