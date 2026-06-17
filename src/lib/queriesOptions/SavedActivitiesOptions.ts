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
    const response = await fetch("/api/savedActivities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        savedActivity,
        userID,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to save food");
    }

    return response.json().catch(() => ({}));
  },
});
