import { FoodInput, FoodClass } from "@/types/Types";
import { safeFetch } from "./safeFetch";

export const AddFoodOptions = () => ({
  mutationFn: (foodData: FoodInput) =>
    safeFetch<FoodClass>(
      () =>
        fetch("/api/food", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(foodData),
          credentials: "include",
        }),
      "Failed to add food to database",
    ),
});
