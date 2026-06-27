import { SavedFoodClass, ApiResponse } from "@/types/Types";
import { queryOptions } from "@tanstack/react-query";

export const LastWeekFoodOptions = (dateFrom: string, dateTo: string) =>
  queryOptions({
    queryKey: ["lastWeekFood", dateTo, dateFrom] as const,
    queryFn: async ({ queryKey }): Promise<SavedFoodClass[]> => {
      const [, dateTo, dateFrom] = queryKey;
      const isServer = typeof window === "undefined";
      const baseUrl = isServer ? process.env.NEXTAUTH_URL : "";

      const res = await fetch(
        `${baseUrl}/api/lastWeekFood?dateFrom=${dateFrom}&dateTo=${dateTo}`,
        { cache: "no-store", credentials: "include" },
      );

      const result = (await res.json().catch(() => ({}))) as ApiResponse<SavedFoodClass[]>;
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to fetch food");
      }

      // Tell TypeScript this returns an array of SavedFoodClass
      return result.data as SavedFoodClass[];
    },
    staleTime: 1000 * 60 * 15,
    retry: 0,
  });

