import { queryOptions } from "@tanstack/react-query";
import { WaterEntryType } from "@/types/Types";
import { safeFetch } from "./safeFetch";

export const LastMonthWaterOptions = (dateFrom: string, dateTo: string) =>
  queryOptions({
    queryKey: ["lastMonthWater", dateTo, dateFrom] as const,
    queryFn: () => {
      let baseUrl = "";
      if (typeof window === "undefined") {
        baseUrl =
          process.env.NEXTAUTH_URL ||
          (process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000");
      }
      return safeFetch<Record<string, WaterEntryType[]>>(
        () =>
          fetch(
            `${baseUrl}/api/lastMonthWater?dateFrom=${dateFrom}&dateTo=${dateTo}`,
            { cache: "no-store", credentials: "include" },
          ),
        "Failed to fetch last month water logs",
      );
    },
    staleTime: 600000,
    retry: 0,
    refetchOnWindowFocus: false,
  });
