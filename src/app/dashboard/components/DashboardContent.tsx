"use client";

import { CalorieCard } from "./CalorieCard";

import useLoadSavedFood from "@/hooks/useLoadSavedFood";
import { useSession } from "next-auth/react";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";

import { AccordionTimeFrame } from "./AccordionTimeFrame/AccordionTimeFrame";
import { TodayMacros } from "./TodayMacros/TodayMacros";
import MyGraph from "@/app/myprogress/MyGraph";
import { DateSwitcher } from "./DateSwitcher/DateSwitcher";
import { add } from "date-fns";

export const DashboardContent = () => {
  const { data } = useSession();
  const { isFetched } = useLoadSavedFood({
    userId: data?.user?.id,
    daysAgo: 10,
  });
  const { savedFood, currentDate, setNewDateAndGetFood } =
    useYourIntakeOperations();

  const setNewDateAndFetchFood = (numberOfDays: number) => {
    const date = add(currentDate, {
      days: numberOfDays,
    });

    setNewDateAndGetFood(date);
  };
  return (
    <div className="flex flex-col gap-3">
      {/* <h2 className="text-xl font-bold text-foreground mb-2">Daily Progress</h2> */}
      <DateSwitcher
        currentDate={currentDate}
        setNewDateAndFetchFood={setNewDateAndFetchFood}
      ></DateSwitcher>
      <div className="flex flex-row gap-3">
        <CalorieCard intakeToday={savedFood}></CalorieCard>
        <TodayMacros savedFood={savedFood}></TodayMacros>
      </div>
      <AccordionTimeFrame savedFood={savedFood} />
      <MyGraph />
    </div>
  );
};
