import type { foodType } from "@/types/foodTypes";
import {
  ModelOptions,
  Severity,
  getModelForClass,
  index,
  post,
  prop,
} from "@typegoose/typegoose";
import mongoose, { Model } from "mongoose";

@post<SavedFoodClass>("find", function (food) {
  if (food) {
    food.day = food.day;
  }
})
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
  @prop({ required: true, unique: true })
  day: Date;
  @prop({ required: true })
  savedFood: foodType;
  @prop({ required: true }) //false for now, when i figure out how to make users
  user_id: mongoose.Types.ObjectId | string;
}

const SavedFood = getModelForClass(SavedFoodClass);

export { SavedFood, SavedFoodClass };
