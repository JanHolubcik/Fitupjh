import { useEffect, useMemo } from "react";

import { useDispatch } from "react-redux";
import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { setSavedFoodMonth } from "@/features/savedFoodslice/yourIntakeSlice";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { SavedFoodMonth } from "@/types/Types";

type props = {
  daysAgo?: number;
  userId: string | undefined;
};

/**
 *
 * @param userId
 * @param daysAgo greater than 0.
 * @returns
 */
const useLoadSavedFood = ({ userId, daysAgo }: props) => {
  const dispatch = useDispatch();

  const today = useMemo(() => new Date().toISOString(), []);
  const fromDate = useMemo(
    () => (daysAgo ? subDays(new Date(), daysAgo).toISOString() : ""),
    [],
  );

  const {
    data: monthData,
    isSuccess,
    isFetched,
  } = useQuery(LastMonthFoodOptions(userId || "", fromDate, today));

  useEffect(() => {
    if (isSuccess && Array.isArray(monthData)) {
      const dateKeyedData = monthData.reduce((acc, item) => {
        const date = format(item.day, "yyyy-MM-dd");
        const { breakfast, lunch, dinner } = item.savedFood;

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
