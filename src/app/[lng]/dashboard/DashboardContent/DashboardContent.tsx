"use client";

import "driver.js/dist/driver.css";
import CalorieCard from "./components/CalorieCard/CalorieCard";
import useLoadSavedFood from "@/hooks/useLoadSavedFood";
import AccordionTimeFrame from "./components/AccordionTimeFrame/AccordionTimeFrame";
import TodayMacros from "./components/TodayMacros/TodayMacros";

import DateSwitcher from "./components/DateSwitcher/DateSwitcher";

import {
  DateSwitcherSkeleton,
  CalorieCardSkeleton,
  TodayMacrosSkeleton,
  AccordionTimeFrameSkeleton,
  MyGraphSkeleton,
} from "./components/Skeletons";

import { authClient } from "@/lib/auth-client";

import MyGraph from "@/components/ChartProgress/GraphProgressComponent";
import useGuide from "@/hooks/useGuide";
import AccordionActivity from "../AccordionActivity/AccordionActivity";
import { useEffect, useState } from "react";

type props = {
  dateTo: string;
  dateFrom: string;
};

const DashboardContent = ({ dateTo, dateFrom }: props) => {
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const { isFetching } = useLoadSavedFood({ dateTo, dateFrom });

  useEffect(() => {
    setMounted(true);
  }, []);

  useGuide({ isFetched: !isFetching, user: session?.user || undefined });
  if (!mounted || isFetching || isPending)
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
    <div className="flex flex-col gap-3 mt-3 items-center p-3 max-w-2xl w-full font-bold">
      <DateSwitcher />
      <div className="flex sm:flex-row flex-col gap-3 w-full">
        <CalorieCard />
        <TodayMacros />
      </div>

      <AccordionTimeFrame />
      <AccordionActivity />
      <MyGraph />
    </div>
  );
};

export default DashboardContent;
