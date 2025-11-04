import { queryOptions } from "@tanstack/react-query";

export const DailyIntakeOptions = (userId: string, date: string) =>
  queryOptions({
    queryKey: ["savedFood", userId, date],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/saveFood?date=${date}&user_id=${userId}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error("Failed to fetch food");

      return res.json();
    },
    staleTime: 30_000,
    retry: 1,
  });
