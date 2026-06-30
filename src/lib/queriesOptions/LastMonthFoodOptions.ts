import { FoodType } from "@/types/Types";
import { queryOptions } from "@tanstack/react-query";
import { safeFetch } from "./safeFetch";

export const LastMonthFoodOptions = (dateFrom: string, dateTo: string) =>
  queryOptions({
    queryKey: ["lastMonthFood", dateTo, dateFrom] as const,
    queryFn: () => {
      let baseUrl = "";
      if (typeof window === "undefined") {
        baseUrl =
          process.env.NEXTAUTH_URL ||
          (process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000");
      }
      return safeFetch<Record<string, FoodType>>(
        () =>
          fetch(
            `${baseUrl}/api/lastMonthFood?dateFrom=${dateFrom}&dateTo=${dateTo}`,
            { cache: "no-store", credentials: "include" },
          ),
        "Failed to fetch last month food",
      );
    },
    staleTime: 1000 * 60 * 15,
    retry: 0,
  });
