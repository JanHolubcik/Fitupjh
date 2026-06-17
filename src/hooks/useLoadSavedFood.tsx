import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSuspenseQuery } from "@tanstack/react-query";

import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { setSavedFoodMonth } from "@/features/DashboardSlice/DashboardSlice";

type props = {
  fromDate: string;
  today: string;
};

const useLoadSavedFood = ({ today, fromDate }: props) => {
  const dispatch = useDispatch();

  const { data: savedFoodData, isFetching: isFetchingFood } = useSuspenseQuery(
    LastMonthFoodOptions(fromDate, today),
  );

  useEffect(() => {
    dispatch(setSavedFoodMonth(savedFoodData));
  }, [savedFoodData, dispatch]);

  const isFetching = isFetchingFood;

  return { isFetching };
};

export default useLoadSavedFood;
