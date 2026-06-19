import { ApiResponse } from "@/lib/api-response";
import { FoodClass } from "@/lib/mongo/models/Food";
import { useMutation } from "@tanstack/react-query";

export type ScanResponse = FoodClass & {
  notFound?: boolean;
  barcode?: string;
  originalName?: string;
};

export const useScanProduct = (onProductNotFound: () => void) => {
  return useMutation<ScanResponse, Error, string>({
    mutationFn: async (qrCode: string): Promise<ScanResponse> => {
      const response = await fetch(
        `/api/foodScan?QRCode=${encodeURIComponent(qrCode)}`,
        { credentials: "include", method: "POST" },
      );

      if (response.status === 404) {
        return { notFound: true, QRcode: qrCode } as ScanResponse;
      }

      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => ({}))) as ApiResponse<never>;
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const apiResponse = (await response.json()) as ApiResponse<ScanResponse>;

      if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.error || "Failed to scan product.");
      }

      return apiResponse.data;
    },
    onSuccess: (data) => {
      if (data && !data.notFound) {
        console.log("Product successfully processed:", data);
      } else {
        console.warn("Product not found in database. Prompting manual entry.");
        onProductNotFound();
      }
    },
    onError: (error) => {
      console.error("Scanning operation failed:", error.message);
    },
  });
};
