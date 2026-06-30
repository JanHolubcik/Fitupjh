import { queryOptions } from "@tanstack/react-query";
import { LoggedActivityType } from "@/types/Types";
import { safeFetch } from "./safeFetch";

export const LastMonthSavedActivities = (dateFrom: string, dateTo: string) =>
  queryOptions({
    queryKey: ["lastMonthSavedActivity", dateTo, dateFrom] as const,
    queryFn: () => {
      let baseUrl = "";
      if (typeof window === "undefined") {
        baseUrl =
          process.env.NEXTAUTH_URL ||
          (process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000");
      }
      return safeFetch<Record<string, LoggedActivityType[]>>(
        () =>
          fetch(
            `${baseUrl}/api/lastMonthSavedActivity?dateFrom=${dateFrom}&dateTo=${dateTo}`,
            { cache: "no-store", credentials: "include" },
          ),
        "Failed to fetch last month saved activities",
      );
    },
    staleTime: 600000,
    retry: 0,
    refetchOnWindowFocus: false,
  });
