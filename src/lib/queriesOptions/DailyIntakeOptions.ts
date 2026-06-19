import { FoodType } from "@/types/Types";
import { ApiResponse } from "@/lib/api-response";
import { queryOptions } from "@tanstack/react-query";

export const DailyIntakeOptions = (userId: string, date: string) =>
  queryOptions({
    queryKey: ["savedFood", userId, date],
    queryFn: async (): Promise<FoodType> => {
      const isServer = typeof window === "undefined";
      const baseUrl = isServer
        ? process.env.NEXTAUTH_URL // full URL on server
        : ""; // relative on client

      const res = await fetch(
        `${baseUrl}/api/saveFood?date=${date}&user_id=${userId}`,
        { cache: "no-store", credentials: "include" },
      );

      const result = (await res.json().catch(() => ({}))) as ApiResponse<FoodType>;
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to fetch food");
      }

      return result.data as FoodType;
    },
    staleTime: 1000 * 60 * 15,
    retry: 1,
  });

