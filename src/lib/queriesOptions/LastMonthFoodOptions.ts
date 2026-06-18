import { FoodType } from "@/types/Types";
import { queryOptions } from "@tanstack/react-query";

export const LastMonthFoodOptions = (dateFrom: string, dateTo: string) =>
  queryOptions({
    queryKey: ["lastMonthFood", dateTo, dateFrom] as const,
    queryFn: async () => {
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

      return res.json() as Promise<Record<string, FoodType>>;
    },
    staleTime: 1000 * 60 * 15,
    retry: 0,
  });
