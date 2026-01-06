import { useEffect, useMemo, useRef } from "react";

import { useDispatch } from "react-redux";
import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { setSavedFoodMonth } from "@/features/savedFoodslice/savedFoodSlice";
import { useQuery } from "@tanstack/react-query";

const useLoadSavedFood = (userId: string | undefined) => {
  const dispatch = useDispatch();
  const dispatched = useRef(false); // track if we already sent to Redux

  const today = useMemo(() => new Date().toISOString(), []);

  const { data: monthData, isSuccess } = useQuery(
    LastMonthFoodOptions(userId || "", "", today)
  );

  useEffect(() => {
    if (isSuccess && monthData) {
      dispatch(setSavedFoodMonth(monthData));
      dispatched.current = true; // mark as dispatched
    }
  }, [isSuccess, monthData, dispatch]);
};
export default useLoadSavedFood;
