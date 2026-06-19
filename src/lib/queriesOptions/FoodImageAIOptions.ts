import { AIFoodAnalysis } from "@/types/Types";
import { ApiResponse } from "@/lib/api-response";

export const FoodImageAIOptions = () => ({
  mutationFn: async (imageBase64: string): Promise<AIFoodAnalysis> => {
    const response = await fetch("/api/foodImageAI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageBase64 }),
    });

    const result = (await response.json().catch(() => ({}))) as ApiResponse<AIFoodAnalysis>;
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to analyze image");
    }

    return result.data as AIFoodAnalysis;
  },
});

