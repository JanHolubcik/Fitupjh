import { z } from "zod";

export const WaterEntrySchema = z.object({
  id: z.union([z.string(), z.number()]),
  amount: z.number().gt(0, "validation.waterAmountGtZero"),
});

export const SaveWaterSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "validation.dateInvalid"),
  entries: z.array(WaterEntrySchema),
});

export type WaterEntryInput = z.infer<typeof WaterEntrySchema>;
export type SaveWaterInput = z.infer<typeof SaveWaterSchema>;
