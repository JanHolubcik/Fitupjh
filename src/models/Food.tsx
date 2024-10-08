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
@post<FoodClass[]>(/^find/, function (food) {
  // @ts-ignore
  if (this.op === "find") {
    food.forEach((food) => {
      food.id = food._id.toString();
      food._id = food.id;
    });
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
  calories_per_100g: number;
  @prop({ default: false })
  _id: mongoose.Types.ObjectId | string;
  id: string;
}

const Food = getModelForClass(FoodClass);
export { Food, FoodClass };
