import { queryOptions } from "@tanstack/react-query";
import { ActivityClass } from "../mongo/models/Activity";

export const ActivitiesOptions = () =>
  queryOptions({
    queryKey: ["activity"],
    queryFn: async () => {
      const isServer = typeof window === "undefined";
      const baseUrl = isServer
        ? process.env.NEXTAUTH_URL // full URL on server
        : ""; // relative on client

      const res = await fetch(`${baseUrl}/api/activity`, {
        cache: "no-store",
        credentials: "include",
        method: "GET",
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      return res.json() as Promise<ActivityClass[]>;
    },
    staleTime: 30_000,
    retry: 1,
  });
