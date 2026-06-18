import { queryOptions } from "@tanstack/react-query";
import { LoggedActivityType } from "@/features/DashboardSlice/DashboardSlice";

export const LastMonthSavedActivities = (dateFrom: string, dateTo: string) =>
  queryOptions({
    queryKey: ["lastMonthSavedActivity", dateTo, dateFrom] as const,
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
        `${baseUrl}/api/lastMonthSavedActivity?dateFrom=${dateFrom}&dateTo=${dateTo}`,
        { cache: "no-store", credentials: "include" },
      );

      return res.json() as Promise<Record<string, LoggedActivityType[]>>;
    },
    staleTime: 600000,
    retry: 0,
    refetchOnWindowFocus: false,
  });
