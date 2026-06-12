import { UsersClass } from "@/models/users";
import { queryOptions } from "@tanstack/react-query";

export type ClientUser = Omit<UsersClass, "_id"> & {
  _id: string;
};

export const UserInfoOptions = () =>
  queryOptions({
    queryKey: ["userInfo"],
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

      return res.json() as Promise<ClientUser>;
    },
    staleTime: 30_000,
    retry: 1,
  });
