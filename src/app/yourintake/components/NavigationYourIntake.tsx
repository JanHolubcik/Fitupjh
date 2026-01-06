import TimeFrame from "@/components/TimeFrame/TimeFrame";
import ProgressBars from "@/components/ProgressBars/ProgressBars";
import { useYourIntakeContext } from "@/hooks/YourIntakeContext";
import { timeOfDay } from "@/types/Types";
import { Button, Tooltip, Image, CircularProgress } from "@nextui-org/react";
import { add, format } from "date-fns";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaInfoCircle,
  FaSearch,
} from "react-icons/fa";
import { useCalculateRecommendedCalories } from "../hooks/useCalculateRecomendedCalories";

const NavigationYourIntake = ({ onOpen }: { onOpen: () => void }) => {
  const { currentDate, setNewDateAndGetFood, savedFood } =
    useYourIntakeContext();
  const { recommendedCaloriesValue, caloriesSum } =
    useCalculateRecommendedCalories(savedFood);
  const color = caloriesSum > recommendedCaloriesValue ? "warning" : "danger";

  const setNewDateAndFetchFood = (numberOfDays: number) => {
    const date = add(currentDate.current, {
      days: numberOfDays,
    });
    setNewDateAndGetFood(date);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-evenly">
        <div className="flex flex-row">
          <Button
            className="self-center"
            size="sm"
            onPress={() => {
              setNewDateAndFetchFood(-1);
            }}
            isIconOnly
          >
            <FaArrowLeft />
          </Button>
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

          <Button
            size="sm"
            className="self-center"
            onPress={() => {
              setNewDateAndFetchFood(+1);
            }}
            isIconOnly
          >
            <FaArrowRight />
          </Button>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center p-4">
        <FaCalendarAlt></FaCalendarAlt>
        <p className="text-sm ml-2">
          {format(currentDate.current, "dd.MMM, eeee")}
        </p>
        <Tooltip
          showArrow
          content={
            <div className="p-1 m-1 max-w-64">
              <div className="flex justify-center">
                <Image
                  className="object-contain"
                  alt="Info"
                  src="eplaining_owl.png"
                  width={90}
                  height={90}
                />
              </div>

              <div className="m-1 self-center ">
                <h1 className="bold mb-2 font-bold  text-b">
                  Here lies your calorie tracker.
                </h1>
                <p>
                  Progress circle will show of how many % of your daily intake
                  did you take already.
                </p>
                <p className="ml-0 mt-2 ">
                  Use the left and right buttons to switch between dates. You
                  can also log any food you forgot to add earlier.
                </p>
                <p className="ml-0 mt-2 ">
                  Click the Find food button to log your food. It will
                  automatically log in lunch, dinner or supper. You can also
                  choose time frame you want to log the food.
                </p>
              </div>
            </div>
          }
        >
          <div className="m-0 gap-0 p-0  bg-transparent cursor-default">
            <FaInfoCircle className="ml-2"></FaInfoCircle>
          </div>
        </Tooltip>
      </div>

      <Button
        startContent={
          <FaSearch className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
        }
        id="search"
        className="m-6 "
        onPress={onOpen}
      >
        Click to find food...
      </Button>

      <ProgressBars />

      {timeOfDay.map((key) => (
        <TimeFrame key={key} timeOfDay={key as timeOfDay} />
      ))}
    </div>
  );
};

export default NavigationYourIntake;
