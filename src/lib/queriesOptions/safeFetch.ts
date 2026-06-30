import { ApiResponse } from "@/types/Types";

export const safeFetch = async <T>(
  requestFn: () => Promise<Response>,
  fallbackErrorMessage: string = "Request failed",
): Promise<T> => {
  if (typeof window !== "undefined" && !navigator.onLine) {
    throw new Error("OFFLINE");
  }

  try {
    const response = await requestFn();

    if (response.status === 429) {
      throw new Error("RATE_LIMIT");
    }

    if (!response.ok) {
      throw new Error("SERVER_ERROR");
    }

    const result = (await response.json().catch(() => ({}))) as ApiResponse<T>;
    if (!result.success) {
      throw new Error(result.error || fallbackErrorMessage);
    }

    return result.data as T;
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message.toLowerCase().includes("failed to fetch")
    ) {
      throw new Error("OFFLINE");
    }
    throw error;
  }
};
