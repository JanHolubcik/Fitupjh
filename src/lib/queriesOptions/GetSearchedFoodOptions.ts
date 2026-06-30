import { FoodClass } from "@/types/Types";
import { safeFetch } from "./safeFetch";

export const getSearchedFoodOptions = (
  searchTerm: string,
  currentLocale: string,
) => ({
  queryKey: ["foodSearch", searchTerm, currentLocale],
  mutationFn: () =>
    safeFetch<(FoodClass & { originalName?: string })[]>(
      () =>
        fetch(
          `${typeof window === "undefined" ? process.env.NEXTAUTH_URL : ""}/api/food?searchTerm=${searchTerm}&currentLocale=${currentLocale}`,
          {
            credentials: "include",
            method: "GET",
          },
        ),
      "Update failed",
    ),
});
