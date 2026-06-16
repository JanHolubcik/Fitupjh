import { getQueryClient } from "@/get-query-client";

import {
  UserInfoOptions,
  ClientUser,
} from "@/lib/queriesOptions/UserInfoOptions";
import { getUser } from "@/lib/user-db";
import { headers } from "next/headers";

import { DashboardContent } from "./DashboardContent/DashboardContent";
import { auth } from "@/lib/auth";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
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
      <DashboardContent />
    </main>
  );
}
