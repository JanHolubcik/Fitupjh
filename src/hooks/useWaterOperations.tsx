"use client";

import { format, subDays } from "date-fns";
import { showToast } from "@/utils/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useT } from "next-i18next/client";

import { useCurrentDate } from "@/hooks/useDashboardState";
import { LastMonthWaterOptions } from "@/lib/queriesOptions/LastMonthWaterOptions";
import { SaveWaterOptions } from "@/lib/queriesOptions/SaveWaterOptions";
import { authClient } from "@/lib/auth-client";
import { WaterEntryType } from "@/types/Types";
import { useCallback } from "react";

const useWaterOperations = () => {
  const { data } = authClient.useSession();
  const queryClient = useQueryClient();
  const { t } = useT("dashboard");

  const saveWaterMutation = useMutation(SaveWaterOptions());

  const [currentDate] = useCurrentDate();
  const dateString = format(currentDate, "yyyy-MM-dd");

  const dateTo = format(new Date(), "yyyy-MM-dd");
  const dateFrom = format(subDays(new Date(), 30), "yyyy-MM-dd");

  const { data: savedWaterMonth = {} } = useQuery(
    LastMonthWaterOptions(dateFrom, dateTo),
  );
  const savedWaterEntries = savedWaterMonth[dateString] ?? [];

  const totalWaterMl = savedWaterEntries.reduce(
    (sum, entry) => sum + entry.amount,
    0,
  );

  const saveWaterToDB = useCallback(
    async (entriesToSave: WaterEntryType[]) => {
      if (!data?.user?.id) return;

      try {
        await saveWaterMutation.mutateAsync({
          date: dateString,
          entries: entriesToSave,
          userID: data.user.id,
        });
      } catch (err) {
        console.error("Error saving water intake:", err);
        throw err;
      }
    },
    [data, dateString, saveWaterMutation],
  );

  const addWater = useCallback(
    async (amount: number) => {
      if (amount <= 0) return;

      const newEntry: WaterEntryType = {
        id: Date.now().toString(),
        amount: Math.round(amount),
      };

      const queryKey = LastMonthWaterOptions(dateFrom, dateTo).queryKey;
      queryClient.setQueryData(
        queryKey,
        (oldData: Record<string, WaterEntryType[]> | undefined) => {
          const updated = oldData ? { ...oldData } : {};
          if (!updated[dateString]) {
            updated[dateString] = [];
          }
          updated[dateString] = [...updated[dateString], newEntry];
          return updated;
        },
      );

      const updatedEntries = [...savedWaterEntries, newEntry];
      const res = saveWaterToDB(updatedEntries);

      showToast.promise(res, {
        pending: t("toast.pending"),
        success: t("toast.waterSuccess"),
        error: t("toast.waterError"),
      });
    },
    [dateFrom, dateTo, dateString, queryClient, savedWaterEntries, saveWaterToDB, t],
  );

  const removeWater = useCallback(
    async (entryId: string | number) => {
      const updatedEntries = savedWaterEntries.filter(
        (item) => item.id.toString() !== entryId.toString(),
      );

      const queryKey = LastMonthWaterOptions(dateFrom, dateTo).queryKey;
      queryClient.setQueryData(
        queryKey,
        (oldData: Record<string, WaterEntryType[]> | undefined) => {
          const updated = oldData ? { ...oldData } : {};
          updated[dateString] = updatedEntries;
          return updated;
        },
      );

      const res = saveWaterToDB(updatedEntries);

      showToast.promise(res, {
        pending: t("toast.pending"),
        success: t("toast.waterRemoved"),
        error: t("toast.waterError"),
      });
    },
    [dateFrom, dateTo, dateString, queryClient, savedWaterEntries, saveWaterToDB, t],
  );

  const clearWater = useCallback(async () => {
    const queryKey = LastMonthWaterOptions(dateFrom, dateTo).queryKey;
    queryClient.setQueryData(
      queryKey,
      (oldData: Record<string, WaterEntryType[]> | undefined) => {
        const updated = oldData ? { ...oldData } : {};
        updated[dateString] = [];
        return updated;
      },
    );

    const res = saveWaterToDB([]);

    showToast.promise(res, {
      pending: t("toast.pending"),
      success: t("toast.waterRemoved"),
      error: t("toast.waterError"),
    });
  }, [dateFrom, dateTo, dateString, queryClient, saveWaterToDB, t]);

  return {
    savedWaterEntries,
    totalWaterMl,
    addWater,
    removeWater,
    clearWater,
  };
};

export default useWaterOperations;
