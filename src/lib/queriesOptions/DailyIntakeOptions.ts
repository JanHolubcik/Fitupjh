import { FoodType } from "@/types/Types";
import { queryOptions } from "@tanstack/react-query";
import { safeFetch } from "./safeFetch";

export const DailyIntakeOptions = (userId: string, date: string) =>
  queryOptions({
    queryKey: ["savedFood", userId, date],
    queryFn: () =>
      safeFetch<FoodType>(
        () =>
          fetch(
            `${typeof window === "undefined" ? process.env.NEXTAUTH_URL : ""}/api/saveFood?date=${date}&user_id=${userId}`,
            { cache: "no-store", credentials: "include" },
          ),
        "Failed to fetch food",
      ),
    staleTime: 1000 * 60 * 15,
    retry: 1,
  });
