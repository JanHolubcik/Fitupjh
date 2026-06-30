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

import { useT } from "next-i18next/client";
import MyGraph from "@/components/ChartProgress/GraphProgressComponent";
import useGuide from "@/hooks/useGuide";
import AccordionActivity from "../AccordionActivity/AccordionActivity";
import { useEffect, useState } from "react";
import { CardError } from "@/components/common";
import { FaExclamationTriangle } from "react-icons/fa";

type props = {
  dateTo: string;
  dateFrom: string;
};

const DashboardContent = ({ dateTo, dateFrom }: props) => {
  const { t } = useT("dashboard");
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const { isFetching, isError, isErrorFood, isErrorActivity, refetch } =
    useLoadSavedFood({
      dateTo,
      dateFrom,
    });

  useEffect(() => {
    setMounted(true);
  }, []);

  useGuide({
    isFetched: !isFetching && !isError,
    user: session?.user || undefined,
  });

  if (!mounted || isPending) return null;

  if (isFetching)
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

      {isErrorFood ? (
        <CardError
          title={t("error.failedToLoadFood")}
          description={t("error.failedToLoadDesc")}
          icon={<FaExclamationTriangle />}
          refetch={refetch}
        />
      ) : (
        <>
          <div className="flex sm:flex-row flex-col gap-3 w-full">
            <CalorieCard />
            <TodayMacros />
          </div>
          <AccordionTimeFrame />
        </>
      )}

      {isErrorActivity ? (
        <CardError
          title={t("error.failedToLoadActivity")}
          description={t("error.failedToLoadDesc")}
          icon={<FaExclamationTriangle />}
          refetch={refetch}
        />
      ) : (
        <AccordionActivity />
      )}
      {isErrorActivity && isErrorFood ? (
        <CardError
          title={t("error.failedToLoadActivity")}
          description={t("error.failedToLoadDesc")}
          icon={<FaExclamationTriangle />}
          refetch={refetch}
        />
      ) : (
        <MyGraph />
      )}
    </div>
  );
};

export default DashboardContent;
