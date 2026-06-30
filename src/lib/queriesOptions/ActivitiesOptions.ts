import { queryOptions } from "@tanstack/react-query";
import { ActivityClass } from "@/types/Types";
import { safeFetch } from "./safeFetch";

export const ActivitiesOptions = () =>
  queryOptions({
    queryKey: ["activity"],
    queryFn: () =>
      safeFetch<ActivityClass[]>(
        () =>
          fetch(
            `${typeof window === "undefined" ? process.env.NEXTAUTH_URL : ""}/api/activity`,
            {
              cache: "no-store",
              credentials: "include",
              method: "GET",
            },
          ),
        "Failed to fetch activities",
      ),
    staleTime: 30_000,
    retry: 1,
  });
