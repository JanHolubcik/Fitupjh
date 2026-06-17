import { getQueryClient } from "@/get-query-client";

import { headers } from "next/headers";

import { DashboardContent } from "./DashboardContent/DashboardContent";
import { auth } from "@/lib/auth";
import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { addDays, subDays } from "date-fns";
import { checkForSavedFoodMonth } from "@/lib/mongo/food-db";
import { SavedFoodClass } from "@/lib/mongo/models/SavedFood";

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
  if (session?.user?.email) {
    const today = getMidnightISO(addDays(new Date(), 1));
    const fromDate = getMidnightISO(subDays(new Date(), 30));
    try {
      const food = await checkForSavedFoodMonth(
        fromDate,
        today,
        session.user.id,
      );
      const plainFood = JSON.parse(JSON.stringify(food));
      queryClient.setQueryData(
        LastMonthFoodOptions(fromDate, today).queryKey,
        plainFood as SavedFoodClass[],
      );
    } catch (error) {
      console.error("Failed to prefetch user data", error);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-65px)]   flex-col items-center p-12 pt-0 bg-default-50/50">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardContent />
      </HydrationBoundary>
    </main>
  );
}
