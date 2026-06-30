import { LoggedActivityType } from "@/types/Types";
import { safeFetch } from "./safeFetch";

export const SavedActivitiesOptions = () => ({
  mutationFn: ({
    date,
    savedActivity,
    userID,
  }: {
    date: string;
    savedActivity: LoggedActivityType[];
    userID: string;
  }) =>
    safeFetch<string>(
      () =>
        fetch("/api/savedActivity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            activities: savedActivity,
            userID,
          }),
          credentials: "include",
        }),
      "Failed to save activities",
    ),
});
