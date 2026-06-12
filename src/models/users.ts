import {
  getModelForClass,
  index,
  ModelOptions,
  prop,
  Severity,
} from "@typegoose/typegoose";

import mongoose from "mongoose";

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
  goal: "lose weight" | "gain weight" | "maintain weight";
  @prop({ required: false })
  weight: number; //kilos
  @prop({ required: false })
  weightGoal: number; //kilos
  @prop({ required: false })
  height: number; //in cm
  @prop({ required: false })
  activityLevel:
    | "sedatory"
    | "lightly active"
    | "medium active"
    | "highly active";
  @prop({ required: false })
  targetCalories: number;
  @prop({ required: false })
  targetProtein: number;
  @prop({ required: false })
  targetCarbs: number;
  @prop({ required: false })
  targetFat: number;
}

const User = getModelForClass(UsersClass);

export { User, UsersClass };
