import { FoodClass } from "@/models/Food";

export const getSearchedFoodOptions = (searchTerm: string) => ({
  queryKey: ["foodSearch", searchTerm],
  mutationFn: async () => {
    const isServer = typeof window === "undefined";
    const baseUrl = isServer ? process.env.NEXTAUTH_URL : "";
    const res = await fetch(`${baseUrl}/api/food?searchTerm=${searchTerm}`, {
      credentials: "include",
      method: "GET",
    });

    if (!res.ok) throw new Error("Update failed");
    return res.json() as Promise<(FoodClass & { originalName?: string })[]>;
  },
});
