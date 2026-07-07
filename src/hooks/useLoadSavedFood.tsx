import { useQuery } from "@tanstack/react-query";

import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { LastMonthSavedActivities } from "@/lib/queriesOptions/LastMonthSavedActivitiesOptions";

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

  const isFetching = isFetchingFood || isFetchingActivity;
  const isError = isErrorFood || isErrorActivity;

  const refetch = async () => {
    await Promise.all([refetchFood(), refetchActivity()]);
  };

  return {
    isFetching,
    isError,
    isErrorFood,
    isErrorActivity,
    refetch,
  };
};

export default useLoadSavedFood;

