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
    console.log("AI response status:", res);
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  },
});
