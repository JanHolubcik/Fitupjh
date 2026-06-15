import { getQueryClient } from "@/get-query-client";
import { authOptions } from "@/lib/auth";
import {
  UserInfoOptions,
  ClientUser,
} from "@/lib/queriesOptions/UserInfoOptions";
import { getUser } from "@/lib/user-db";
import { getServerSession } from "next-auth";

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { DashboardContent } from "./DashboardContent/DashboardContent";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const queryClient = getQueryClient();
  if (session?.user?.email) {
    try {
      const userData = await getUser(session.user.email);

      queryClient.setQueryData(
        UserInfoOptions().queryKey,
        userData as ClientUser,
      );
    } catch (error) {
      console.error("Failed to prefetch user data", error);
    }
  }

  void queryClient.prefetchQuery(UserInfoOptions());
  return (
    <main className="flex min-h-screen flex-col items-center p-24 pt-0 bg-default-50/50">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardContent />
      </HydrationBoundary>
    </main>
  );
}
