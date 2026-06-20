import { FoodInput } from "@/lib/validationShemas/foodValidationSchema";
import { ApiResponse } from "@/lib/api-response";
import { FoodClass } from "@/lib/mongo/models/Food";

export const AddFoodOptions = () => ({
  mutationFn: async (foodData: FoodInput): Promise<FoodClass> => {
    const response = await fetch("/api/food", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(foodData),
      credentials: "include",
    });

    const result = (await response.json().catch(() => ({}))) as ApiResponse<FoodClass>;
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to add food to database");
    }

    return result.data as FoodClass;
  },
});
