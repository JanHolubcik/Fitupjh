"use client";
import { LastWeekFoodOptions } from "@/lib/queriesOptions/LastWeekFoodOptions";
import { CalorieCard } from "./CalorieCard";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { timeOfDay } from "@/types/Types";
import { TimeFrameSmallCard } from "./TimeFrameSmallCard/TimeFrameSmallCard";
export const DashboardContent = () => {
  const date = format(new Date(), "yyyy-MM-dd").toString();
  const {
    data: weekData,
    isSuccess,
    isFetched,
    isLoading,
  } = useQuery(LastWeekFoodOptions("", date));
  const todayIntake = weekData
    ? weekData[weekData.length - 1]?.savedFood
      ? weekData[weekData.length - 1]?.savedFood
      : null
    : null;
  console.log(weekData);

  return (
    <div>
      <div className="flex flex-row">
        <CalorieCard intakeToday={todayIntake}></CalorieCard>
        <div className="flex flex-col">
          {timeOfDay.map((key) => (
            <TimeFrameSmallCard key={key} timeFrame={key} />
          ))}
        </div>
      </div>
    </div>
  );
};
