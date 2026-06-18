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

    if (!response.ok) {
      throw new Error("Failed to save food");
    }

    return response.json().catch(() => ({}));
  },
  staleTime: 1000 * 60 * 15,
});
