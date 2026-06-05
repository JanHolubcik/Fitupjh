import type { FoodType } from "@/types/Types";
import {
  ModelOptions,
  Severity,
  getModelForClass,
  index,
  prop,
} from "@typegoose/typegoose";
import mongoose from "mongoose";

/**
 * Saved food class represent user saved food trough day.
 */
@index({ title: 1 })
@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "savedFood",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class SavedFoodClass {
  @prop({ required: true })
  day: Date;
  @prop({ required: false }) // can be empty or not defined
  savedFood: FoodType;
  @prop({ required: true }) //false for now, when i figure out how to make users
  user_id: mongoose.Types.ObjectId;
}

const SavedFood = getModelForClass(SavedFoodClass);

export { SavedFood, SavedFoodClass };
