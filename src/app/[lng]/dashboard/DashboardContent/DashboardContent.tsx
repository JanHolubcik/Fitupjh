"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { CalorieCard } from "./components/CalorieCard/CalorieCard";
import useLoadSavedFood from "@/hooks/useLoadSavedFood";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { AccordionTimeFrame } from "./components/AccordionTimeFrame/AccordionTimeFrame";
import { TodayMacros } from "./components/TodayMacros/TodayMacros";

import { DateSwitcher } from "./components/DateSwitcher/DateSwitcher";

import {
  DateSwitcherSkeleton,
  CalorieCardSkeleton,
  TodayMacrosSkeleton,
  AccordionTimeFrameSkeleton,
  MyGraphSkeleton,
} from "./components/Skeletons";
import { useT } from "next-i18next/client";
import { authClient } from "@/lib/auth-client";
import { useIsSm } from "../../constants/FunctionsHelper";
import MyGraph from "@/components/ChartProgress/GraphProgressComponent";

export const DashboardContent = () => {
  const { t } = useT("dashboard");
  const { data: session } = authClient.useSession();
  const { isFetched } = useLoadSavedFood({ daysAgo: 30 });
  const { savedFood } = useYourIntakeOperations();
  const isMobile = !useIsSm();

  useEffect(() => {
    if (isFetched && session?.user && session.user.guideSeen === false) {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: "#tour-date",
            popover: {
              title: t("tour.timeTravel.title"),
              description: t("tour.timeTravel.description"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tour-calories",
            popover: {
              title: t("tour.calorieBudget.title"),
              description: t("tour.calorieBudget.description"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tour-macros",
            popover: {
              title: t("tour.macroBreakdown.title"),
              description: t("tour.macroBreakdown.description"),
              side: "bottom",
              align: "start",
            },
          },

          {
            element: "#tour-meals",
            popover: {
              title: t("tour.yourMeals.title"),
              description: t("tour.yourMeals.description"),
              side: "top",
              align: "start",
            },
          },
          {
            element: "#tour-chart",
            popover: {
              title: t("tour.yourProgress.title"),
              description: t("tour.yourProgress.description"),
              side: "top",
              align: "start",
            },
          },
          {
            element: isMobile
              ? "#tour-profile-mobile"
              : "#tour-profile-desktop",
            popover: {
              title: t("tour.yourProfile.title"),
              description: t("tour.yourProfile.description"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: isMobile ? "#tour-search-bar-mobile" : "#tour-search-bar",
            popover: {
              title: t("tour.manualSearch.title"),
              description: t("tour.manualSearch.description"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: isMobile ? "#tour-search-bar-mobile" : "#tour-barcode-ai",
            popover: {
              title: t("tour.smartScanning.title"),
              description: t("tour.smartScanning.description"),
              side: "top",
              align: "center",
            },
          },
        ],
        onDestroyStarted: async () => {
          driverObj.destroy();

          // Update the database so they never see it again
          try {
            await authClient.updateUser({ guideSeen: true });
          } catch (error) {
            console.error("Failed to update guide status:", error);
          }
        },
      });

      setTimeout(() => driverObj.drive(), 200);
    }
  }, [isFetched, session]);

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
    <div className="flex flex-col gap-3 mt-3 items-center max-w-2xl w-full font-bold">
      <DateSwitcher />

      <div className="flex sm:flex-row flex-col gap-3 sm:w-full">
        <CalorieCard intakeToday={savedFood} />

        <TodayMacros savedFood={savedFood} />
      </div>

      <AccordionTimeFrame savedFood={savedFood} />

      <MyGraph />
    </div>
  );
};
