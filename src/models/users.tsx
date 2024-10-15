import { getModelForClass, index, ModelOptions, prop, Severity } from "@typegoose/typegoose";

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
  @prop({ required: [true,"Name is required"], unique: true })
  userName: string;
  @prop({ required: true})
  userPassword: string;
  @prop({ required: [true,"Password is required"], unique: true, match: [
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    "Email is invalid",
  ],  })
  userEmail: string;
  @prop({ default: false }) 
  _id: mongoose.Types.ObjectId | string;
}

const users = getModelForClass(UsersClass);

export { users, UsersClass };