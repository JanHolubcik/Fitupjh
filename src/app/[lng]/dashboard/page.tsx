import { getQueryClient } from "@/get-query-client";

import { headers } from "next/headers";

import { DashboardContent } from "./DashboardContent/DashboardContent";
import { auth } from "@/lib/auth";
import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { addDays, format, subDays } from "date-fns";
import { checkForSavedFoodMonth } from "@/lib/mongo/food-db";

import {
  checkForSavedActivitiesMonth,
  getActivity,
} from "@/lib/mongo/activity-db";
import { ActivitiesOptions } from "@/lib/queriesOptions/ActivitiesOptions";
import { ActivityClass } from "@/lib/mongo/models/Activity";

import { LastMonthSavedActivities } from "@/lib/queriesOptions/LastMonthSavedActivitiesOptions";
import { LoggedActivityType } from "@/features/DashboardSlice/DashboardSlice";
import { FoodType } from "@/types/Types";

const getMidnightISO = (date: Date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString(); // Output: "YYYY-MM-DDT00:00:00.000Z"
};

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const queryClient = getQueryClient();
  const today = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const fromDate = format(subDays(new Date(), 30), "yyyy-MM-dd");
  if (session?.user?.id) {
    try {
      const food = await checkForSavedFoodMonth(
        fromDate,
        today,
        session.user.id,
      );

      queryClient.setQueryData(
        LastMonthFoodOptions(fromDate, today).queryKey,
        food as Record<string, FoodType>,
      );

      const activities = await getActivity();
      const plainActivities = JSON.parse(JSON.stringify(activities));

      queryClient.setQueryData(
        ActivitiesOptions().queryKey,
        plainActivities as ActivityClass[],
      );

      const dayTo = format(addDays(new Date(), 1), "yyyy-MM-dd");
      const dayFrom = format(subDays(new Date(), 30), "yyyy-MM-dd");

      const savedActivities = await checkForSavedActivitiesMonth(
        dayFrom,
        dayTo,
        session.user.id,
      );

      queryClient.setQueryData(
        LastMonthSavedActivities(dayFrom, dayTo).queryKey,
        savedActivities as Record<string, LoggedActivityType[]>,
      );
    } catch (error) {
      console.error("Failed to prefetch user data", error);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-65px)]   flex-col items-center p-12 pt-0 bg-default-50/50">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardContent today={today} fromDate={fromDate} />
      </HydrationBoundary>
    </main>
  );
}
