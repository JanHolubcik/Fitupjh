import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export const useCurrentDate = () => {
  const queryClient = useQueryClient();
  const { data: currentDate = format(new Date(), "yyyy-MM-dd") } = useQuery<string>({
    queryKey: ["currentDate"],
    queryFn: () => format(new Date(), "yyyy-MM-dd"),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const setCurrentDate = (date: string) => {
    queryClient.setQueryData(["currentDate"], date);
  };

  return [currentDate, setCurrentDate] as const;
};

export const useNewFoodBarCode = () => {
  const queryClient = useQueryClient();
  const { data: newFoodBarCode = "" } = useQuery<string>({
    queryKey: ["newFoodBarCode"],
    queryFn: () => "",
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const setNewFoodBarCode = (barcode: string) => {
    queryClient.setQueryData(["newFoodBarCode"], barcode);
  };

  return [newFoodBarCode, setNewFoodBarCode] as const;
};
