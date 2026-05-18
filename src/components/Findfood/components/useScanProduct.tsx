import { FoodClass } from "@/models/Food";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useScanProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<FoodClass, Error, string>({
    mutationFn: async (qrCode: string) => {
    
      const response = await fetch(`/api/food?QRCode=${encodeURIComponent(qrCode)}`);

      if (!response.ok) {
       
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log("Product successfully processed:", data);
    },
    onError: (error) => {
      console.error("Scanning operation failed:", error.message);
    },
  });
};