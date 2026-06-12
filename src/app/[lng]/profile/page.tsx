import ProfileMainComponent from "@/components/ProfileMainComponent/ProfileMainComponent";
import { getQueryClient } from "@/get-query-client";
import { authOptions } from "@/lib/auth";
import {
  ClientUser,
  UserInfoOptions,
} from "@/lib/queriesOptions/UserInfoOptions";
import { getUser } from "@/lib/user-db";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getServerSession } from "next-auth";

export default async function Profile() {
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
    <main className="min-h-screen px-4 py-8 md:px-8 bg-default-50/50">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProfileMainComponent />
      </HydrationBoundary>
    </main>
  );
}
