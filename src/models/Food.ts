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
 * Food class represents food in name and macros.
 */
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
  @prop({ required: false})// means that food is a product (yogurt for example) which means he has fixed weight that needs to be calculated
  ProductWeight: number;
  @prop({ required: false })// we search for products by it's qrcode, if it doesn't exist, we need to call external api to get macros
  QRcode: string;
  @prop({required: false})
  imgUrl: string;
}

const Food = getModelForClass(FoodClass, {
  existingMongoose: mongoose,
  schemaOptions: {
    collection: "food",
  },
});

export { Food, FoodClass };
