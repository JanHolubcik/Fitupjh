"use server";
import { format } from "date-fns";

import { getQueryClient } from "@/get-query-client";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import MyGraph from "./MyGraph";

export default async function MyProgress() {
  const session = await getServerSession(authOptions);
  const queryClient = getQueryClient();

  if (session?.user?.id) {
    const userId = session.user.id;
    const today = format(new Date(), "yyyy-MM-dd");

    await queryClient.prefetchQuery(LastMonthFoodOptions(userId, "", today));
  }
  return (
    <main className="flex min-h-screen flex-col items-center p-24 pt-0">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MyGraph />
      </HydrationBoundary>
    </main>
  );
}
