import { queryOptions } from "@tanstack/react-query";

export const UserInfoOptions = (id: string) =>
  queryOptions({
    queryKey: ["userInfo", id],
    queryFn: async () => {
      const isServer = typeof window === "undefined";
      const baseUrl = isServer
        ? process.env.NEXTAUTH_URL // full URL on server
        : ""; // relative on client

      const res = await fetch(`${baseUrl}/api/user`, {
        cache: "no-store",
        credentials: "include",
        method: "GET",
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      return res.json();
    },
    staleTime: 30_000,
    retry: 1,
  });
