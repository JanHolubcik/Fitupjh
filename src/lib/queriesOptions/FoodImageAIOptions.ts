export const FoodImageAIOptions = () => ({
  mutationFn: async (imageBase64: string) => {
    const response = await fetch("/api/foodImageAI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageBase64 }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to analyze image");
    }

    return result.data;
  },
});
