"use client";

import {
  AccordionTimeFrameSkeleton,
  CalorieCardSkeleton,
  DateSwitcherSkeleton,
  MyGraphSkeleton,
  TodayMacrosSkeleton,
} from "./DashboardContent/components/Skeletons";

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-65px)] w-full items-center justify-center bg-zinc-50/80 dark:bg-[#09090b]">
      <div className="flex flex-col gap-3 mt-3 items-center max-w-2xl w-full ">
        <DateSwitcherSkeleton />
        <div className="flex sm:flex-row flex-col gap-3 w-full">
          <CalorieCardSkeleton />
          <TodayMacrosSkeleton />
        </div>
        <AccordionTimeFrameSkeleton />
        <MyGraphSkeleton />
      </div>
    </div>
  );
}
