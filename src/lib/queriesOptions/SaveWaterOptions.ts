import { WaterEntryType } from "@/types/Types";
import { safeFetch } from "./safeFetch";

export const SaveWaterOptions = () => ({
  mutationFn: ({
    date,
    entries,
    userID,
  }: {
    date: string;
    entries: WaterEntryType[];
    userID: string;
  }) =>
    safeFetch<string>(
      () =>
        fetch("/api/saveWater", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            entries,
            userID,
          }),
          credentials: "include",
        }),
      "Failed to save water",
    ),
});
