import { SavedFoodClass } from "@/models/savedFood";
import { queryOptions } from "@tanstack/react-query";

export const LastMonthFoodOptions = (
  userId: string,
  dateFrom: string,
  dateTo: string
) =>
  queryOptions({
    queryKey: ["lastMonthFood", userId, dateTo, dateFrom] as const,
    queryFn: async ({ queryKey }) => {
      const [, userId, dateTo, dateFrom] = queryKey;
      const isServer = typeof window === "undefined";
      const baseUrl = isServer ? process.env.NEXTAUTH_URL : "";

      const res = await fetch(
        `${baseUrl}/api/lastMonthFood?dateFrom=${dateFrom}&dateTo=${dateTo}&user_id=${userId}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error("Failed to fetch food");

      // Tell TypeScript this returns an array of SavedFoodClass
      return res.json() as Promise<SavedFoodClass[]>;
    },
    staleTime: 600000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
