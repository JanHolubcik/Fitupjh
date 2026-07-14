import { z } from "zod";

export const LoggedActivitySchema = z.object({
  id: z.union([z.string(), z.number()]),
  activity: z.string().min(1, "validation.activityRequired"),
  durationMinutes: z.number().min(0, "validation.durationMin"),
  caloriesBurned: z.number().min(0, "validation.caloriesBurnedMin"),
});

export const SaveActivitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "validation.dateInvalid"),
  activities: z.array(LoggedActivitySchema),
});

export type SaveActivityInput = z.infer<typeof SaveActivitySchema>;
export type LoggedActivityInput = z.infer<typeof LoggedActivitySchema>;

export const ActivityCatalogSchema = z.object({
  name: z.string().min(2, "validation.nameMinLength"),
  metValue: z.coerce.number().gt(0, "validation.metValueGtZero"),
  category: z.string().optional(),
  icon: z.string().optional(),
});

export type ActivityCatalogInput = z.infer<typeof ActivityCatalogSchema>;
