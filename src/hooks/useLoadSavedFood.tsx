import { useEffect, useMemo, useRef } from "react";

import { useDispatch } from "react-redux";
import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { setSavedFoodMonth } from "@/features/savedFoodslice/savedFoodSlice";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { SavedFoodMonth } from "@/types/Types";

const useLoadSavedFood = (userId: string | undefined) => {
  const dispatch = useDispatch();

  const today = useMemo(() => new Date().toISOString(), []);

  const {
    data: monthData,
    isSuccess,
    isFetched,
  } = useQuery(LastMonthFoodOptions(userId || "", "", today));

  useEffect(() => {
    if (isSuccess && monthData) {
      const dateKeyedData = monthData.reduce((acc, item) => {
        const date = format(item.day, "yyyy-MM-dd");
        const { breakfast, lunch, dinner } = item.savedFood;

        if (
          breakfast.length === 0 &&
          lunch.length === 0 &&
          dinner.length === 0
        ) {
          return acc;
        }

        acc[date] = {
          breakfast,
          lunch,
          dinner,
        };

        return acc;
      }, {} as SavedFoodMonth);

      dispatch(setSavedFoodMonth(dateKeyedData));
    }
  }, [isSuccess, monthData, dispatch]);

  return { isFetched };
};
export default useLoadSavedFood;
