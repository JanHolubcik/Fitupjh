import { SavedFoodClass } from "@/types/Types";
import { queryOptions } from "@tanstack/react-query";
import { safeFetch } from "./safeFetch";

export const LastWeekFoodOptions = (dateFrom: string, dateTo: string) =>
  queryOptions({
    queryKey: ["lastWeekFood", dateTo, dateFrom] as const,
    queryFn: ({ queryKey }) => {
      const [, dateToVal, dateFromVal] = queryKey;
      return safeFetch<SavedFoodClass[]>(
        () =>
          fetch(
            `${typeof window === "undefined" ? process.env.NEXTAUTH_URL : ""}/api/lastWeekFood?dateFrom=${dateFromVal}&dateTo=${dateToVal}`,
            { cache: "no-store", credentials: "include" },
          ),
        "Failed to fetch food",
      );
    },
    staleTime: 1000 * 60 * 15,
    retry: 0,
  });
