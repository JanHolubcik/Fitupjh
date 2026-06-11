"use client";

import { CalorieCard } from "./CalorieCard";

import useLoadSavedFood from "@/hooks/useLoadSavedFood";
import { useSession } from "next-auth/react";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";

import { AccordionTimeFrame } from "./AccordionTimeFrame/AccordionTimeFrame";
import { TodayMacros } from "./TodayMacros/TodayMacros";
import MyGraph from "@/app/[lng]/myprogress/MyGraph";
import { DateSwitcher } from "./DateSwitcher/DateSwitcher";

import {
  DateSwitcherSkeleton,
  CalorieCardSkeleton,
  TodayMacrosSkeleton,
  AccordionTimeFrameSkeleton,
  MyGraphSkeleton,
} from "./Skeletons";

import { ModalScanMacros } from "./ModalScanMacros/ModalScanMacros";

export const DashboardContent = () => {
  const { data } = useSession();
  const { isFetched } = useLoadSavedFood({
    userId: data?.user?.id,
    daysAgo: 10,
  });
  const { savedFood } = useYourIntakeOperations();

  if (!isFetched)
    return (
      <div className="flex flex-col gap-3 mt-3 items-center max-w-2xl w-full ">
        <DateSwitcherSkeleton />
        <div className="flex sm:flex-row flex-col gap-3 w-full">
          <CalorieCardSkeleton />
          <TodayMacrosSkeleton />
        </div>
        <AccordionTimeFrameSkeleton />
        <MyGraphSkeleton />
      </div>
    );

  return (
    <div className="flex flex-col gap-3  mt-3  items-center max-w-2xl w-full">
      {/* <h2 className="text-xl font-bold text-foreground mb-2">Daily Progress</h2> */}
      <ModalScanMacros />
      <DateSwitcher></DateSwitcher>

      <div className="flex sm:flex-row flex-col gap-3 sm:w-full ">
        <CalorieCard intakeToday={savedFood}></CalorieCard>

        <TodayMacros savedFood={savedFood}></TodayMacros>
      </div>
      <AccordionTimeFrame savedFood={savedFood} />
      <MyGraph />
    </div>
  );
};
