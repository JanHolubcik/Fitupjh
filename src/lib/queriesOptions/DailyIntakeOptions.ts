import { queryOptions } from "@tanstack/react-query";

export const DailyIntakeOptions = (userId: string, date: string) =>
  queryOptions({
    queryKey: ["savedFood", userId, date],
    queryFn: async () => {
      const isServer = typeof window === "undefined";
      const baseUrl = isServer
        ? process.env.NEXT_PUBLIC_BASE_URL // full URL on server
        : ""; // relative on client

      const res = await fetch(
        `${baseUrl}/api/saveFood?date=${date}&user_id=${userId}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error("Failed to fetch food");

      return res.json();
    },
    staleTime: 30_000,
    retry: 1,
  });
