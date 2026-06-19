import { FoodType } from "@/types/Types";
import { ApiResponse } from "@/lib/api-response";
import { queryOptions } from "@tanstack/react-query";

export const LastMonthFoodOptions = (dateFrom: string, dateTo: string) =>
  queryOptions({
    queryKey: ["lastMonthFood", dateTo, dateFrom] as const,
    queryFn: async (): Promise<Record<string, FoodType>> => {
      const isServer = typeof window === "undefined";
      let baseUrl = "";
      if (isServer) {
        baseUrl =
          process.env.NEXTAUTH_URL ||
          (process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000");
      }
      const res = await fetch(
        `${baseUrl}/api/lastMonthFood?dateFrom=${dateFrom}&dateTo=${dateTo}`,
        { cache: "no-store", credentials: "include" },
      );

      const result = (await res.json().catch(() => ({}))) as ApiResponse<Record<string, FoodType>>;
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to fetch last month food");
      }

      return result.data as Record<string, FoodType>;
    },
    staleTime: 1000 * 60 * 15,
    retry: 0,
  });

