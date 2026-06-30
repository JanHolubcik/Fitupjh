import { AIFoodAnalysis } from "@/types/Types";
import { safeFetch } from "./safeFetch";

export const FoodImageAIOptions = (localization: string) => ({
  mutationFn: (imageBase64: string) =>
    safeFetch<AIFoodAnalysis>(
      () =>
        fetch("/api/foodImageAI", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageBase64, localization }),
        }),
      "Failed to analyze image",
    ),
});
