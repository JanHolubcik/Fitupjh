import { z } from "zod";

export const LoggedActivitySchema = z.object({
  id: z.union([z.string(), z.number()]),
  activity: z.string().min(1, "Activity name is required"),
  durationMinutes: z.number().min(0, "Duration must be at least 0"),
  caloriesBurned: z.number().min(0, "Calories burned must be at least 0"),
});

export const SaveActivitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  activities: z.array(LoggedActivitySchema),
});

export type SaveActivityInput = z.infer<typeof SaveActivitySchema>;
export type LoggedActivityInput = z.infer<typeof LoggedActivitySchema>;
