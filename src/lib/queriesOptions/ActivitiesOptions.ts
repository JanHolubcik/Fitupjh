import { queryOptions } from "@tanstack/react-query";
import { ActivityClass } from "../mongo/models/Activity";
import { ApiResponse } from "@/lib/api-response";

export const ActivitiesOptions = () =>
  queryOptions({
    queryKey: ["activity"],
    queryFn: async (): Promise<ActivityClass[]> => {
      const isServer = typeof window === "undefined";
      const baseUrl = isServer
        ? process.env.NEXTAUTH_URL // full URL on server
        : ""; // relative on client

      const res = await fetch(`${baseUrl}/api/activity`, {
        cache: "no-store",
        credentials: "include",
        method: "GET",
      });

      const result = (await res.json()) as ApiResponse<ActivityClass[]>;
      if (!res.ok || !result.success) throw new Error(result.error || "Failed to fetch activities");

      return result.data as ActivityClass[];
    },
    staleTime: 30_000,
    retry: 1,
  });

