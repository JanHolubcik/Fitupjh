import { SavedFoodClass } from "@/models/savedFood";
import { queryOptions } from "@tanstack/react-query";

export const LastMonthFoodOptions = (dateFrom: string, dateTo: string) =>
  queryOptions({
    queryKey: ["lastMonthFood", dateTo, dateFrom] as const,
    queryFn: async ({ queryKey }) => {
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
        `${baseUrl}/api/lastMonthFood?dateFrom=${dateFrom}&dateTo=${dateTo}`,
        { cache: "no-store", credentials: "include" },
      );

      if (!res.ok) {
        // Try to read the error message sent by the server, if any
        let errorText = "No response body";
        try {
          errorText = await res.text();
        } catch (e) {
          // Ignore parsing errors
        }

        console.error("=== API FETCH FAILED ===");
        console.error("URL:", "Xd");
        console.error("Status:", res.status, res.statusText);
        console.error(
          "Environment:",
          isServer ? "Server (SSR)" : "Client (Browser)",
        );
        console.error("Response Body:", errorText);
        console.error("========================");
      }
      // Tell TypeScript this returns an array of SavedFoodClass
      return res.json() as Promise<SavedFoodClass[]>;
    },
    staleTime: 600000,
    retry: 0,
    refetchOnWindowFocus: false,
  });
