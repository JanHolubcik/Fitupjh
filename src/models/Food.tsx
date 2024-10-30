import {
  ModelOptions,
  Severity,
  getModelForClass,
  index,
  post,
  prop,
} from "@typegoose/typegoose";
import mongoose from "mongoose";

@post<FoodClass>("save", function (food) {
  if (food) {
    food.id = food._id.toString();
    food._id = food.id;
  }
})
@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "food",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
@index({ title: 1 })
class FoodClass {
  @prop({ required: true, unique: true })
  name: string;
  @prop({ required: true })
  calories_per_100g: number;
  @prop({ required: true })
  fat: number;
  @prop({ required: true })
  protein: number;
  @prop({ required: true })
  sugar: number;
  @prop({ required: true })
  carbohydrates: number;
  @prop({ required: true })
  fiber: number;
  @prop({ required: true })
  salt: number;
}

const Food = getModelForClass(FoodClass);
export { Food, FoodClass };
