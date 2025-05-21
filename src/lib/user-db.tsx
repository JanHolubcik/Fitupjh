import { User } from "@/models/users";
import connectDB from "./connect-db";

export async function getUser() {
  try {
    await connectDB();
    const user = await User.findOne({
      userEmail: "Janko@manko.sk",
    }).select("+userPassword");

    return user;
  } catch (error) {
    return { error };
  }
}

export async function updateUser(height: number, weight: number, goal: string) {
  try {
    await connectDB();
    const user = await User.updateOne(
      {
        userEmail: "Janko@manko.sk",
      },
      { $set: { height: height, weight: weight, goal: goal } }
    );

    return user;
  } catch (error) {
    return { error };
  }
}
