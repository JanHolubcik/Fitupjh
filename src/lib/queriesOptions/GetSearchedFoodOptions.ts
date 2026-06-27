import { FoodClass, ApiResponse } from "@/types/Types";

export const getSearchedFoodOptions = (
  searchTerm: string,
  currentLocale: string,
) => ({
  queryKey: ["foodSearch", searchTerm, currentLocale],
  mutationFn: async (): Promise<(FoodClass & { originalName?: string })[]> => {
    const isServer = typeof window === "undefined";
    const baseUrl = isServer ? process.env.NEXTAUTH_URL : "";
    const res = await fetch(
      `${baseUrl}/api/food?searchTerm=${searchTerm}&currentLocale=${currentLocale}`,
      {
        credentials: "include",
        method: "GET",
      },
    );

    const result = (await res.json()) as ApiResponse<(FoodClass & { originalName?: string })[]>;
    if (!res.ok || !result.success) throw new Error(result.error || "Update failed");
    return result.data as (FoodClass & { originalName?: string })[];
  },
});

