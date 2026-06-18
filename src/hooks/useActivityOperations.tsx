import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query"; // Adjust if you use TRPC instead
import { useT } from "next-i18next/client";

import { RootState, AppDispatch } from "@/store/store";

import { authClient } from "@/lib/auth-client";
import {
  selectSavedActivitiesByDate,
  LoggedActivityType,
  addActivityForDate,
  removeActivity,
  editActivity,
} from "@/features/DashboardSlice/DashboardSlice";

import { SavedActivitiesOptions } from "@/lib/queriesOptions/SavedActivitiesOptions";
import { useCallback } from "react";

export const useActivityOperations = () => {
  const { data } = authClient.useSession();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useT("dashboard");

  const saveActivityMutation = useMutation(SavedActivitiesOptions());

  const currentDate = useSelector(
    (state: RootState) => state.savedFood.currentDate,
  );

  const savedActivities = useSelector((state: RootState) =>
    selectSavedActivitiesByDate(state, format(currentDate, "yyyy-MM-dd")),
  );

  const saveActivitiesToDB = async (
    activitiesToSave?: LoggedActivityType[],
    isLastItem: boolean = false,
  ) => {
    if (!data) return;

    const activities = activitiesToSave || savedActivities;

    if (activities.length === 0 && !isLastItem) return;

    try {
      await saveActivityMutation.mutateAsync({
        date: format(currentDate, "yyyy-MM-dd"),
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
    const date = format(currentDate, "yyyy-MM-dd");
    const uniqueId = Date.now();

    const newActivityRecord: LoggedActivityType = {
      id: uniqueId,
      activity: payload.activity,
      durationMinutes: payload.durationMinutes,
      caloriesBurned: payload.caloriesBurned,
    };

    dispatch(
      addActivityForDate({
        date,
        activity: newActivityRecord,
      }),
    );

    const updatedActivities = [...savedActivities, newActivityRecord];

    const res = saveActivitiesToDB(updatedActivities);

    toast.promise(
      res,
      {
        pending: t("toast.pending", "Saving activity..."),
        success: t("toast.activitySuccess", "Activity was logged!"),
        error: t("toast.activityError", "Error while logging activity."),
      },
      {
        position: "bottom-left",
        autoClose: 5000,
        theme: "dark",
      },
    );
  };

  const updateActivity = useCallback(
    async (updatedActivity: LoggedActivityType) => {
      dispatch(
        editActivity({
          date: format(currentDate, "yyyy-MM-dd"),
          id: updatedActivity.id,
          updatedActivity: updatedActivity,
        }),
      );

      const fullUpdatedObject = [...savedActivities, updatedActivity];

      const res = saveActivitiesToDB(fullUpdatedObject);

      toast.promise(
        res,
        {
          pending: t("toast.pending", "Sending request..."),
          success: t("toast.updated", "Food was updated!"),
          error: t("toast.error", "There was an error updating your intake."),
        },
        { theme: "dark", position: "bottom-left" },
      );
    },
    [dispatch, currentDate, t],
  );

  const removeFromSavedActivity = async (id: string | number) => {
    dispatch(
      removeActivity({
        date: format(currentDate, "yyyy-MM-dd"),
        id,
      }),
    );

    const updatedActivities = savedActivities.filter((a) => a.id !== id);
    const isLastItem = updatedActivities.length === 0;

    const res = saveActivitiesToDB(updatedActivities, isLastItem);

    toast.promise(
      res,
      {
        pending: t("toast.pending", "Removing activity..."),
        success: t("toast.activityRemoved", "Activity was removed!"),
        error: t("toast.error", "Error updating your activities."),
      },
      {
        position: "bottom-left",
        autoClose: 5000,
        theme: "dark",
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
