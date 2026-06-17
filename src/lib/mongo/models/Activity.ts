import {
  ModelOptions,
  Severity,
  getModelForClass,
  index,
  post,
  prop,
} from "@typegoose/typegoose";
import mongoose from "mongoose";

/**
 * Activity class represents a master catalog of exercises/movements.
 */
@post<ActivityClass>("save", function (activity) {
  if (activity) {
    activity.id = activity._id.toString();
  }
})
@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "activities",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
@index({ name: 1 })
class ActivityClass {
  @prop({ required: true, unique: true })
  name: string;
  @prop({ required: false, type: () => String, default: new Map() })
  localizedNames: Map<string, string>;
  @prop({ required: true })
  metValue: number;

  @prop({ required: false })
  category?: string;
}

const Activity =
  mongoose.models.ActivityClass || getModelForClass(ActivityClass);
export { Activity, ActivityClass };
