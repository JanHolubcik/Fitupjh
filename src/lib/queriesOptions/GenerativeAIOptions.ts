import { SavedFoodMonth } from "@/types/Types";
import { safeFetch } from "./safeFetch";

export const GenerativeAIOptions = (savedFood: SavedFoodMonth) => ({
  mutationFn: () =>
    safeFetch<string>(
      () =>
        fetch(
          `${typeof window === "undefined" ? process.env.NEXTAUTH_URL : ""}/api/generateResponseAI`,
          {
            credentials: "include",
            body: JSON.stringify({
              message: "Please analyze my food intake",
              savedFood: savedFood,
            }),
            method: "POST",
            headers: { "Content-Type": "application/json" },
          },
        ),
      "Request failed",
    ),
});
