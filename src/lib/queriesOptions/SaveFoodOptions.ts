export const SaveFoodOptions = () => ({
  mutationFn: async ({
    date,
    savedFood,
    userID,
  }: {
    date: string;
    savedFood: any;
    userID: string;
  }) => {
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

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to save food");
    }

    return result.data;
  },
});
