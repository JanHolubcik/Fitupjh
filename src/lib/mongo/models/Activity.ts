import {
  ModelOptions,
  Severity,
  getModelForClass,
  post,
  prop,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import mongoose, { Types } from "mongoose";

/**
 * Activity class represents a master catalog of exercises/movements.
 */

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "activities", // Fixed from "food"
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class ActivityClass extends TimeStamps {
  public _id!: Types.ObjectId;
  public id!: string;
  @prop({ required: true, unique: true })
  name: string;
  @prop({ required: false, type: () => String, default: new Map() })
  localizedNames: Map<string, string>;
  @prop({ required: true })
  metValue: number;

  @prop({ required: false })
  category?: string;
  @prop({ required: false })
  icon?: string;
}

const Activity =
  mongoose.models.ActivityClass || getModelForClass(ActivityClass);
export { Activity, ActivityClass };
