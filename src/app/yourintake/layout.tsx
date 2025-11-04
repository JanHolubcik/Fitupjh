import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { format } from "date-fns";

import YourIntakeProvider from "@/hooks/YourIntakeProvider";
import { getQueryClient } from "@/get-query-client";
import { DailyIntakeOptions } from "@/lib/queriesOptions/DailyIntakeOptions";

export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const queryClient = getQueryClient();

  if (session?.user?.id) {
    const userId = session.user.id;
    const today = format(new Date(), "dd.MMM.yyyy");

    await queryClient.prefetchQuery(DailyIntakeOptions(userId, today));
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <YourIntakeProvider
        date={format(new Date(), "dd.MMM.yyyy")}
        userID={session?.user?.id || ""}
      >
        {children}
      </YourIntakeProvider>
    </HydrationBoundary>
  );
}
