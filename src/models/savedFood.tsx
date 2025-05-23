import type { foodType } from "@/types/foodTypes";
import {
  ModelOptions,
  Severity,
  getModelForClass,
  index,
  post,
  prop,
} from "@typegoose/typegoose";
import mongoose from "mongoose";

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
  @prop({ required: true })
  day: Date;
  @prop({ required: false }) // can be empty or not defined
  savedFood: foodType;
  @prop({ required: true }) //false for now, when i figure out how to make users
  user_id: mongoose.Types.ObjectId;
}

const SavedFood = getModelForClass(SavedFoodClass);

export { SavedFood, SavedFoodClass };
