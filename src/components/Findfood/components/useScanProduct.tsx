import { useMutation } from "@tanstack/react-query";

export const useScanProduct = (onProductNotFound: () => void) => {
  return useMutation({
    mutationFn: async (qrCode: string) => {
      const response = await fetch(
        `/api/foodScan?QRCode=${encodeURIComponent(qrCode)}`,
        { credentials: "include", method: "POST" },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      return response.json();
    },
    onSuccess: (data) => {
      {
        if (data.success) {
          console.warn(
            "Product not found in database. Prompting manual entry.",
          );
          onProductNotFound();
        } else {
          console.log("Product successfully processed:", data);
        }
      }
    },
    onError: (error) => {
      console.error("Scanning operation failed:", error.message);
    },
  });
};
