import { LoggedActivityType } from "@/features/DashboardSlice/DashboardSlice";

export const SavedActivitiesOptions = () => ({
  mutationFn: async ({
    date,
    savedActivity,
    userID,
  }: {
    date: string;
    savedActivity: LoggedActivityType[];
    userID: string;
  }) => {
    const response = await fetch("/api/savedActivity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        activities: savedActivity,
        userID,
      }),
      credentials: "include",
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to save activities");
    }

    return result.data;
  },
});
