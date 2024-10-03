import { getModelForClass, index, ModelOptions, prop, Severity } from "@typegoose/typegoose";
import bc from "bcrypt";

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
class UsersClass {
  @prop({ required: true, unique: true })
  userName: string;
  @prop({ required: true })
  userPassword: string;
  @prop({ required: true })
  userEmail: string;
  @prop({ required: true }) 
  id: number;
}

const users = getModelForClass(UsersClass);

export { users, UsersClass };