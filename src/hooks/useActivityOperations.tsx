import { format, subDays } from "date-fns";
import { showToast } from "@/utils/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useT } from "next-i18next/client";

import { useCurrentDate } from "@/hooks/useDashboardState";
import { LastMonthSavedActivities } from "@/lib/queriesOptions/LastMonthSavedActivitiesOptions";
import { SavedActivitiesOptions } from "@/lib/queriesOptions/SavedActivitiesOptions";
import { authClient } from "@/lib/auth-client";
import { LoggedActivityType } from "@/types/Types";
import { useCallback } from "react";

const useActivityOperations = () => {
  const { data } = authClient.useSession();
  const queryClient = useQueryClient();
  const { t } = useT("dashboard");

  const saveActivityMutation = useMutation(SavedActivitiesOptions());

  const [currentDate] = useCurrentDate();
  const dateString = format(currentDate, "yyyy-MM-dd");

  const dateTo = format(new Date(), "yyyy-MM-dd");
  const dateFrom = format(subDays(new Date(), 30), "yyyy-MM-dd");

  const { data: savedActivityMonth = {} } = useQuery(LastMonthSavedActivities(dateFrom, dateTo));
  const savedActivities = savedActivityMonth[dateString] ?? [];

  const saveActivitiesToDB = async (
    activitiesToSave?: LoggedActivityType[],
    isLastItem: boolean = false,
  ) => {
    if (!data) return;

    const activities = activitiesToSave || savedActivities;

    if (activities.length === 0 && !isLastItem) return;

    try {
      await saveActivityMutation.mutateAsync({
        date: dateString,
        savedActivity: activities,
        userID: data.user.id,
      });
    } catch (err) {
      console.error("Error saving activity:", err);
      throw err;
    }
  };

  const addActivityRecord = async (payload: {
    activity: string;
    durationMinutes: number;
    caloriesBurned: number;
  }) => {
    const uniqueId = Date.now();

    const newActivityRecord: LoggedActivityType = {
      id: uniqueId,
      activity: payload.activity,
      durationMinutes: payload.durationMinutes,
      caloriesBurned: payload.caloriesBurned,
    };

    const queryKey = LastMonthSavedActivities(dateFrom, dateTo).queryKey;
    queryClient.setQueryData(queryKey, (oldData: Record<string, LoggedActivityType[]> | undefined) => {
      const data = oldData ? { ...oldData } : {};
      if (!data[dateString]) {
        data[dateString] = [];
      }
      data[dateString] = [...data[dateString], newActivityRecord];
      return data;
    });

    const updatedActivities = [...savedActivities, newActivityRecord];

    const res = saveActivitiesToDB(updatedActivities);

    showToast.promise(
      res,
      {
        pending: t("toast.pending"),
        success: t("toast.activitySuccess"),
        error: t("toast.activityError"),
      },
    );
  };

  const updateActivity = useCallback(
    async (updatedActivity: LoggedActivityType) => {
      const queryKey = LastMonthSavedActivities(dateFrom, dateTo).queryKey;
      queryClient.setQueryData(queryKey, (oldData: Record<string, LoggedActivityType[]> | undefined) => {
        const data = oldData ? { ...oldData } : {};
        if (!data[dateString]) {
          data[dateString] = [];
        }
        data[dateString] = data[dateString].map((act) =>
          act.id === updatedActivity.id ? updatedActivity : act,
        );
        return data;
      });

      const updatedActivities = savedActivities.map((act) =>
        act.id === updatedActivity.id ? updatedActivity : act,
      );

      const res = saveActivitiesToDB(updatedActivities);

      showToast.promise(
        res,
        {
          pending: t("toast.pending"),
          success: t("toast.updated"),
          error: t("toast.error"),
        },
      );
    },
    [dateString, dateFrom, dateTo, queryClient, savedActivities, saveActivitiesToDB, t],
  );

  const removeFromSavedActivity = async (id: string | number) => {
    const queryKey = LastMonthSavedActivities(dateFrom, dateTo).queryKey;
    queryClient.setQueryData(queryKey, (oldData: Record<string, LoggedActivityType[]> | undefined) => {
      const data = oldData ? { ...oldData } : {};
      if (!data[dateString]) {
        data[dateString] = [];
      }
      data[dateString] = data[dateString].filter((act) => act.id !== id);
      return data;
    });

    const updatedActivities = savedActivities.filter((a) => a.id !== id);
    const isLastItem = updatedActivities.length === 0;

    const res = saveActivitiesToDB(updatedActivities, isLastItem);

    showToast.promise(
      res,
      {
        pending: t("toast.pending"),
        success: t("toast.activityRemoved"),
        error: t("toast.error"),
      },
    );
  };

  return {
    savedActivities,
    addActivityRecord,
    removeFromSavedActivity,
    updateActivity,
  };
};

export default useActivityOperations;


