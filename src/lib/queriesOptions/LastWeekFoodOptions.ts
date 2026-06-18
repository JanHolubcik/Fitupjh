import { SavedFoodClass } from "@/lib/mongo/models/SavedFood";
import { queryOptions } from "@tanstack/react-query";

export const LastWeekFoodOptions = (dateFrom: string, dateTo: string) =>
  queryOptions({
    queryKey: ["lastWeekFood", dateTo, dateFrom] as const,
    queryFn: async ({ queryKey }) => {
      const [, dateTo, dateFrom] = queryKey;
      const isServer = typeof window === "undefined";
      const baseUrl = isServer ? process.env.NEXTAUTH_URL : "";

      const res = await fetch(
        `${baseUrl}/api/lastWeekFood?dateFrom=${dateFrom}&dateTo=${dateTo}`,
        { cache: "no-store", credentials: "include" },
      );

      if (!res.ok) throw new Error("Failed to fetch food");

      // Tell TypeScript this returns an array of SavedFoodClass
      return res.json() as Promise<SavedFoodClass[]>;
    },
    staleTime: 1000 * 60 * 15,
    retry: 0,
  });
