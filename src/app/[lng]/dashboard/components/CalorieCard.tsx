import { useCalculateRecommendedCalories } from "@/app/[lng]/yourintake/hooks/useCalculateRecomendedCalories";
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
    <Card className="flex items-center justify-center bg-content1 shadow-lg w-80 max-w-80">
      <CardBody className="flex justify-center items-center p-4">
        <CircularProgress
          classNames={{
            svg: "w-36 h-36 drop-shadow-md",
            indicator: "stroke-white",
            track: "stroke-white/10",
            value: "text-md font-bold text-white",

            label: "text-md text-white  text-center ",
          }}
          size="lg"
          value={caloriesSum}
          color={color}
          label={`${(recommendedCaloriesValue - caloriesSum).toFixed(0)} Kcal remaining`}
          maxValue={recommendedCaloriesValue}
          showValueLabel={true}
        />
      </CardBody>
    </Card>
  );
};
