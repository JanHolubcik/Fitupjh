import { getQueryClient } from "@/get-query-client";
import type { Metadata } from "next";
import enCommon from "@/i18n/locales/en/common.json";
import skCommon from "@/i18n/locales/sk/common.json";

import { headers } from "next/headers";

type GenerateMetadataProps = {
  params: Promise<{ lng: string }>;
};

export const generateMetadata = async ({
  params,
}: GenerateMetadataProps): Promise<Metadata> => {
  const { lng } = await params;
  const common = lng === "sk" ? skCommon : enCommon;
  return {
    title: common.metadata.dashboard,
  };
};

import DashboardContent from "./DashboardContent/DashboardContent";
import { auth } from "@/lib/auth";
import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {  format, subDays } from "date-fns";
import { checkForSavedFoodMonth } from "@/lib/mongo/food-db";

import {
  checkForSavedActivitiesMonth,
  getActivity,
} from "@/lib/mongo/activity-db";
import { ActivitiesOptions } from "@/lib/queriesOptions/ActivitiesOptions";
import { ActivityClass } from "@/types/Types";

import { LastMonthSavedActivities } from "@/lib/queriesOptions/LastMonthSavedActivitiesOptions";
import { LoggedActivityType, FoodType } from "@/types/Types";

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
  const dateTo = format(new Date(), "yyyy-MM-dd");
  const dateFrom = format(subDays(new Date(), 30), "yyyy-MM-dd");
  if (session?.user?.id) {
    try {
      const food = await checkForSavedFoodMonth(
        dateFrom,
        dateTo,
        session.user.id,
      );
      // Here we are using JSON.parse(JSON.stringify(food)) to convert the food to a plain object.
      // We need to make sure that the type of food is matching with function response from 
      // earlier, so we need to try if setQueryData won't throw typescript error before parsing food.
      const plainFood = JSON.parse(JSON.stringify(food));

      queryClient.setQueryData(
        LastMonthFoodOptions(dateFrom, dateTo).queryKey,
        plainFood as Record<string, FoodType>,
      );

      const activities = await getActivity();
      const plainActivities = JSON.parse(JSON.stringify(activities));
      // Same here as before with food.
      queryClient.setQueryData(
        ActivitiesOptions().queryKey,
        plainActivities as ActivityClass[],
      );

      const savedActivities = await checkForSavedActivitiesMonth(
        dateFrom,
        dateTo,
        session.user.id,
      );
      const plainSavedActivities = JSON.parse(JSON.stringify(savedActivities));
      // Same here as before with food.
      queryClient.setQueryData(
        LastMonthSavedActivities(dateFrom, dateTo).queryKey,
        plainSavedActivities as Record<string, LoggedActivityType[]>,
      );
    } catch (error) {
      console.error("Failed to prefetch user data", error);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-65px)] flex-col items-center p-4 sm:p-12 sm:pt-0 pt-0 bg-default-50/50">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardContent dateTo={dateTo} dateFrom={dateFrom} />
      </HydrationBoundary>
    </main>
  );
}
