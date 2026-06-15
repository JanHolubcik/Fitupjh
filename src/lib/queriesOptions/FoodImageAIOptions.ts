export const FoodImageAIOptions = () => ({
  mutationFn: async (imageBase64: string) => {
    const response = await fetch("/api/foodImageAI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageBase64 }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze image");
    }

    return response.json();
  },
});
