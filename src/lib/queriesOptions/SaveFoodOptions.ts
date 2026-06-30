import { FoodType } from "@/types/Types";
import { safeFetch } from "./safeFetch";

export const SaveFoodOptions = () => ({
  mutationFn: ({
    date,
    savedFood,
    userID,
  }: {
    date: string;
    savedFood: FoodType;
    userID: string;
  }) =>
    safeFetch<string>(
      () =>
        fetch("/api/saveFood", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            savedFood,
            userID,
          }),
          credentials: "include",
        }),
      "Failed to save food",
    ),
});
