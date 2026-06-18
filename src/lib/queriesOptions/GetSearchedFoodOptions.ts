import { FoodClass } from "@/models/Food";

export const getSearchedFoodOptions = (
  searchTerm: string,
  currentLocale: string,
) => ({
  queryKey: ["foodSearch", searchTerm, currentLocale],
  mutationFn: async () => {
    const isServer = typeof window === "undefined";
    const baseUrl = isServer ? process.env.NEXTAUTH_URL : "";
    const res = await fetch(
      `${baseUrl}/api/food?searchTerm=${searchTerm}&currentLocale=${currentLocale}`,
      {
        credentials: "include",
        method: "GET",
      },
    );

    if (!res.ok) throw new Error("Update failed");
    return res.json() as Promise<(FoodClass & { originalName?: string })[]>;
  },
  staleTime: 1000 * 60 * 15,
});
