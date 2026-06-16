"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css"; // Required for the spotlight styling

import { CalorieCard } from "./components/CalorieCard/CalorieCard";
import useLoadSavedFood from "@/hooks/useLoadSavedFood";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { AccordionTimeFrame } from "./components/AccordionTimeFrame/AccordionTimeFrame";
import { TodayMacros } from "./components/TodayMacros/TodayMacros";
import MyGraph from "@/components/ChartProgress/GraphProgessComponent";
import { DateSwitcher } from "./components/DateSwitcher/DateSwitcher";

import {
  DateSwitcherSkeleton,
  CalorieCardSkeleton,
  TodayMacrosSkeleton,
  AccordionTimeFrameSkeleton,
  MyGraphSkeleton,
} from "./components/Skeletons";
import { authClient } from "@/lib/auth-client";

export const DashboardContent = () => {
  const { data: session } = authClient.useSession();
  const { isFetched } = useLoadSavedFood({
    userId: session?.user?.id,
    daysAgo: 10,
  });
  const { savedFood } = useYourIntakeOperations();

  // === DRIVER.JS EFFECT ===
  useEffect(() => {
    if (isFetched && session?.user && session.user.guideSeen === false) {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: "#tour-date",
            popover: {
              title: "Time Travel",
              description:
                "Switch between days to view past logs or plan ahead.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tour-calories",
            popover: {
              title: "Calorie Budget",
              description:
                "Keep an eye on your daily budget and remaining calories here.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tour-macros",
            popover: {
              title: "Macro Breakdown",
              description:
                "Track your Protein, Carbs, and Fats to ensure you are hitting your specific goals.",
              side: "bottom",
              align: "start",
            },
          },

          {
            element: "#tour-meals",
            popover: {
              title: "Your Meals",
              description:
                "Expand these sections to view everything you've logged for the day.",
              side: "top",
              align: "start",
            },
          },
          {
            element: "#tour-chart",
            popover: {
              title: "Your Progress",
              description:
                "Watch your consistency pay off! This chart visualizes your intake trends over time.",
              side: "top",
              align: "start",
            },
          },
          {
            element: "#tour-search-bar",
            popover: {
              title: "Manual Search",
              description:
                "Type here to quickly search our database for your favorite foods and ingredients.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tour-barcode-ai",
            popover: {
              title: "Smart Scanning & AI",
              description:
                "Too tired to type? Scan a product's barcode or just snap a photo of your plate, and let our AI do the heavy lifting!",
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
