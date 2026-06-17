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
    collection: "activities", // Fixed from "food"
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
@index({ name: 1 }) // Fixed from "title"
class ActivityClass {
  @prop({ required: true, unique: true })
  name: string;

  // MET (Metabolic Equivalent) is standard for calculating calories burned.
  // E.g., Walking = 3.0, Running = 9.8, Biking = 7.5
  @prop({ required: true })
  metValue: number;

  // Optional: Good for filtering the UI (e.g., "Cardio", "Strength")
  @prop({ required: false })
  category?: string;
}

// Fixed from FoodClass fallback
const Activity =
  mongoose.models.ActivityClass || getModelForClass(ActivityClass);
export { Activity, ActivityClass };
