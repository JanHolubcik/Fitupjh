import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSuspenseQuery } from "@tanstack/react-query";

import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import {
  setSavedActivityMonth,
  setSavedFoodMonth,
} from "@/features/DashboardSlice/DashboardSlice";
import { LastMonthSavedActivities } from "@/lib/queriesOptions/LastMonthSavedActivitiesOptions";

type props = {
  fromDate: string;
  today: string;
};

const useLoadSavedFood = ({ today, fromDate }: props) => {
  const dispatch = useDispatch();

  const { data: savedFoodData, isFetching: isFetchingFood } = useSuspenseQuery(
    LastMonthFoodOptions(fromDate, today),
  );
  const { data: savedActivityData, isFetching: isFetchingActivity } =
    useSuspenseQuery(LastMonthSavedActivities(fromDate, today));

  useEffect(() => {
    dispatch(setSavedActivityMonth(savedActivityData));
  }, [savedActivityData, dispatch]);
  console.log(savedActivityData);
  useEffect(() => {
    dispatch(setSavedFoodMonth(savedFoodData));
  }, [savedFoodData, dispatch]);

  const isFetching = isFetchingFood && isFetchingActivity;

  return { isFetching };
};

export default useLoadSavedFood;
