import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import {
  setSavedActivityMonth,
  setSavedFoodMonth,
} from "@/features/DashboardSlice/DashboardSlice";
import { LastMonthSavedActivities } from "@/lib/queriesOptions/LastMonthSavedActivitiesOptions";

type props = {
  dateFrom: string;
  dateTo: string;
};

const useLoadSavedFood = ({ dateTo, dateFrom }: props) => {
  const dispatch = useDispatch();

  const { data: savedFoodData, isFetching: isFetchingFood } = useQuery(
    LastMonthFoodOptions(dateFrom, dateTo),
  );
  const { data: savedActivityData, isFetching: isFetchingActivity } =
    useQuery(LastMonthSavedActivities(dateFrom, dateTo));

  useEffect(() => {
    if (savedActivityData) {
      dispatch(setSavedActivityMonth(savedActivityData));
    }
  }, [savedActivityData, dispatch]);

  useEffect(() => {
    if (savedFoodData) {
      dispatch(setSavedFoodMonth(savedFoodData));
    }
  }, [savedFoodData, dispatch]);

  const isFetching = isFetchingFood || isFetchingActivity;

  return { isFetching };
};

export default useLoadSavedFood;
