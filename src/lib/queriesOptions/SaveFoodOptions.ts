import { FoodType } from "@/types/Types";
import { ApiResponse } from "@/lib/api-response";

export const SaveFoodOptions = () => ({
  mutationFn: async ({
    date,
    savedFood,
    userID,
  }: {
    date: string;
    savedFood: FoodType;
    userID: string;
  }): Promise<string> => {
    const response = await fetch("/api/saveFood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        savedFood,
        userID,
      }),
      credentials: "include",
    });

    const result = (await response.json().catch(() => ({}))) as ApiResponse<string>;
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to save food");
    }

    return result.data as string;
  },
});

