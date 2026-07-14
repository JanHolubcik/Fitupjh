"use client";

import { useState, useEffect } from "react";
import { useDisclosure } from "@heroui/react";
import { showToast } from "@/utils/toast";
import { ApiResponse } from "@/lib/api-response";

type ActivityItem = {
  _id: string;
  name: string;
  metValue: number;
  category?: string;
  icon?: string;
};

export const useActivitiesTab = (t: any) => {
  const { isOpen: isActivityOpen, onOpen: onActivityOpen, onOpenChange: onActivityOpenChange, onClose: onActivityClose } = useDisclosure();
  const { isOpen: isActivityDeleteOpen, onOpen: onActivityDeleteOpen, onOpenChange: onActivityDeleteOpenChange, onClose: onActivityDeleteClose } = useDisclosure();

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitySearch, setActivitySearch] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<ActivityItem | null>(null);
  const [activityDeleteLoading, setActivityDeleteLoading] = useState(false);
  const [activityPage, setActivityPage] = useState(1);
  const [activityTotalPages, setActivityTotalPages] = useState(1);
  const [isActivityCategoryOpen, setIsActivityCategoryOpen] = useState(false);

  const limit = 6;

  const fetchActivities = async () => {
    setActivitiesLoading(true);
    try {
      const response = await fetch(
        `/api/admin/activity?query=${encodeURIComponent(activitySearch)}&page=${activityPage}&limit=${limit}`
      );
      if (!response.ok) throw new Error();
      const resData = (await response.json()) as ApiResponse<{ activities: ActivityItem[]; total: number }>;
      if (resData.data) {
        setActivities(resData.data.activities || []);
        setActivityTotalPages(Math.ceil(resData.data.total / limit) || 1);
      }
    } catch (error) {
      console.error(error);
      showToast.error(t("toasts.fetchError"));
    } finally {
      setActivitiesLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchActivities, 300);
    return () => clearTimeout(timer);
  }, [activitySearch, activityPage]);

  const handleActivitySearchChange = (val: string) => {
    setActivitySearch(val);
    setActivityPage(1);
  };

  const handleActivityCreateClick = () => {
    setSelectedActivity(null);
    onActivityOpen();
  };

  const handleActivityEditClick = (activity: ActivityItem) => {
    setSelectedActivity(activity);
    onActivityOpen();
  };

  const handleActivityDeleteClick = (activity: ActivityItem) => {
    setActivityToDelete(activity);
    onActivityDeleteOpen();
  };

  const handleActivitySubmit = async (
    values: any,
    { setSubmitting }: { setSubmitting: (b: boolean) => void }
  ) => {
    const isEdit = !!selectedActivity;
    try {
      const method = isEdit ? "PATCH" : "POST";
      const body = isEdit ? { id: selectedActivity._id, ...values } : values;
      const response = await fetch("/api/admin/activity", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error();
      showToast.success(isEdit ? t("toasts.activityUpdateSuccess") : t("toasts.activityCreateSuccess"));
      onActivityClose();
      fetchActivities();
    } catch (error) {
      console.error(error);
      showToast.error(isEdit ? t("toasts.activityUpdateError") : t("toasts.activityCreateError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleActivityDeleteSubmit = async () => {
    if (!activityToDelete) return;
    setActivityDeleteLoading(true);
    try {
      const response = await fetch(`/api/admin/activity?id=${activityToDelete._id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      showToast.success(t("toasts.activityDeleteSuccess"));
      onActivityDeleteClose();
      fetchActivities();
    } catch (error) {
      console.error(error);
      showToast.error(t("toasts.activityDeleteError"));
    } finally {
      setActivityDeleteLoading(false);
    }
  };

  return {
    isActivityOpen,
    onActivityOpenChange,
    onActivityClose,
    isActivityDeleteOpen,
    onActivityDeleteOpenChange,
    onActivityDeleteClose,
    activities,
    activitiesLoading,
    activitySearch,
    selectedActivity,
    activityToDelete,
    activityDeleteLoading,
    activityPage,
    setActivityPage,
    activityTotalPages,
    isActivityCategoryOpen,
    setIsActivityCategoryOpen,
    handleActivitySearchChange,
    handleActivityCreateClick,
    handleActivityEditClick,
    handleActivityDeleteClick,
    handleActivitySubmit,
    handleActivityDeleteSubmit,
  };
};
