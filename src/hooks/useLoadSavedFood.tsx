import { useQuery } from "@tanstack/react-query";

import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { LastMonthSavedActivities } from "@/lib/queriesOptions/LastMonthSavedActivitiesOptions";
import { LastMonthWaterOptions } from "@/lib/queriesOptions/LastMonthWaterOptions";

type props = {
  dateFrom: string;
  dateTo: string;
};

const useLoadSavedFood = ({ dateTo, dateFrom }: props) => {
  const {
    isFetching: isFetchingFood,
    isError: isErrorFood,
    refetch: refetchFood,
  } = useQuery(LastMonthFoodOptions(dateFrom, dateTo));

  const {
    isFetching: isFetchingActivity,
    isError: isErrorActivity,
    refetch: refetchActivity,
  } = useQuery(LastMonthSavedActivities(dateFrom, dateTo));

  const {
    isFetching: isFetchingWater,
    isError: isErrorWater,
    refetch: refetchWater,
  } = useQuery(LastMonthWaterOptions(dateFrom, dateTo));

  const isFetching = isFetchingFood || isFetchingActivity || isFetchingWater;
  const isError = isErrorFood || isErrorActivity || isErrorWater;

  const refetch = async () => {
    await Promise.all([refetchFood(), refetchActivity(), refetchWater()]);
  };

  return {
    isFetching,
    isError,
    isErrorFood,
    isErrorActivity,
    isErrorWater,
    refetch,
  };
};

export default useLoadSavedFood;

