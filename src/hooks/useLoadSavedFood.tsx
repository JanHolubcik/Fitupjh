import { useEffect, useMemo } from "react";

import { useDispatch } from "react-redux";
import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { setSavedFoodMonth } from "@/features/savedFoodslice/yourIntakeSlice";
import { useSuspenseQuery } from "@tanstack/react-query";
import { addDays, format, subDays } from "date-fns";
import { SavedFoodMonth } from "@/types/Types";

type props = {
  daysAgo?: number;
};

const getMidnightISO = (date: Date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString(); // Output: "YYYY-MM-DDT00:00:00.000Z"
};

/**
 *
 * @param userId
 * @param daysAgo greater than 0.
 * @returns
 */
const useLoadSavedFood = ({ daysAgo }: props) => {
  const dispatch = useDispatch();

  const today = useMemo(() => getMidnightISO(addDays(new Date(), 1)), []);

  const fromDate = useMemo(
    () => (daysAgo ? getMidnightISO(subDays(new Date(), daysAgo)) : ""),
    [daysAgo],
  );

  const {
    data: monthData,
    isSuccess,
    isFetched,
  } = useSuspenseQuery(LastMonthFoodOptions(fromDate, today));

  useEffect(() => {
    if (Array.isArray(monthData)) {
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
