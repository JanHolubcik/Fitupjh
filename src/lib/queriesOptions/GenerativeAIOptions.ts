import { SavedFoodMonth } from "@/types/Types";

export const GenerativeAIOptions = (savedFood: SavedFoodMonth) => ({
  mutationFn: async () => {
    const isServer = typeof window === "undefined";
    const baseUrl = isServer ? process.env.NEXTAUTH_URL : "";
    const res = await fetch(`${baseUrl}/api/generateResponseAI`, {
      credentials: "include",
      body: JSON.stringify({
        message: "Please analyze my food intake",
        savedFood: savedFood,
      }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json().catch(() => ({}));
    if (!res.ok || !result.success) {
      throw new Error(result.error || "Request failed");
    }

    return result.data;
  },
  staleTime: 1000 * 60 * 15,
});
