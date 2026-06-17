import {
  ModelOptions,
  Severity,
  getModelForClass,
  index,
  prop,
} from "@typegoose/typegoose";
import mongoose from "mongoose";

import type { Ref } from "@typegoose/typegoose";
import { ActivityClass } from "./Activity";

class LoggedActivity {
  @prop({ ref: () => ActivityClass, required: true })
  activity: Ref<ActivityClass>; // referencing another model

  @prop({ required: true })
  durationMinutes: number;

  @prop({ required: true })
  caloriesBurned: number;
}

@index({ user_id: 1, day: 1 })
@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "savedActivities",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class SavedActivityClass {
  @prop({ required: true })
  day: Date;

  @prop({ type: () => [LoggedActivity], default: [] })
  activities: LoggedActivity[];

  @prop({ required: true })
  user_id: mongoose.Types.ObjectId;
}

const SavedActivity =
  mongoose.models.SavedActivityClass || getModelForClass(SavedActivityClass);

export { SavedActivity, SavedActivityClass };
