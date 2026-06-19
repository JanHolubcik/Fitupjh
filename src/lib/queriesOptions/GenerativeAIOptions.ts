import { SavedFoodMonth } from "@/types/Types";
import { ApiResponse } from "@/lib/api-response";

export const GenerativeAIOptions = (savedFood: SavedFoodMonth) => ({
  mutationFn: async (): Promise<string> => {
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

    const result = (await res.json().catch(() => ({}))) as ApiResponse<string>;
    if (!res.ok || !result.success) {
      throw new Error(result.error || "Request failed");
    }

    return result.data as string;
  },
});

