import type { WaterEntryType } from "@/types/Types";
import {
  ModelOptions,
  Severity,
  getModelForClass,
  index,
  prop,
} from "@typegoose/typegoose";
import mongoose from "mongoose";

class WaterEntryClass {
  @prop({ required: true })
  id: string;

  @prop({ required: true })
  amount: number;
}

/**
 * Saved water class represents user saved water intake throughout the day.
 */
@index({ user_id: 1, day: 1 })
@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "savedWater",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class SavedWaterClass {
  @prop({ required: true })
  day: string;

  @prop({ type: () => [WaterEntryClass], default: [] })
  entries: WaterEntryType[];

  @prop({ required: true })
  user_id: mongoose.Types.ObjectId;
}

const SavedWater =
  mongoose.models.SavedWaterClass || getModelForClass(SavedWaterClass);

export { SavedWater, SavedWaterClass };
