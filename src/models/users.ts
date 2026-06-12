import {
  getModelForClass,
  index,
  ModelOptions,
  prop,
  Severity,
} from "@typegoose/typegoose";

import mongoose from "mongoose";

export type activityLevel =
  | "sedatory"
  | "lightlyActive"
  | "mediumActive"
  | "highlyActive";

export type goal = "loseWeight" | "gainWeight" | "maintainWeight";

@index({ title: 1 })
@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "users",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class UsersClass {
  _id: mongoose.Types.ObjectId;
  @prop({ required: [true, "Name is required"], unique: true })
  userName: string;
  @prop({ required: true })
  userPassword: string;

  @prop({
    required: [true, "Email is required"],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email is invalid"],
  })
  userEmail: string;
  @prop({ required: false })
  image: string;
  @prop({ required: false })
  goal: goal;
  @prop({ required: false })
  weight: number; //kilos
  @prop({ required: false })
  weightGoal: number; //kilos
  @prop({ required: false })
  height: number; //in cm
  @prop({ required: false })
  activityLevel: activityLevel;
  @prop({ required: false })
  targetCalories: number;
  @prop({ required: false })
  targetProtein: number;
  @prop({ required: false })
  targetCarbs: number;
  @prop({ required: false })
  targetFat: number;
  @prop({ required: false })
  targetSugar: number;
  @prop({ required: false })
  manualOverride: boolean;
}

const User = getModelForClass(UsersClass);

export { User, UsersClass };
