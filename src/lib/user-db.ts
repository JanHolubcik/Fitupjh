import "server-only";
import { User, UsersClass } from "@/models/users";
import connectDB from "./connect-db";

export async function getUser(email: string) {
  try {
    await connectDB();
    const user = await User.findOne({
      userEmail: email,
    }).lean();
    return {
      ...user,
      _id: user?._id.toString(),
    };
  } catch (error) {
    return { error };
  }
}

// export async function getUser(email: string) {
//   try {
//     await connectDB();
//     const user = await User.findOne({
//       userEmail: "Janko@manko.sk",
//     }).select("+userPassword");

//     return user;
//   } catch (error) {
//     return { error };
//   }
// }

export async function updateUser(values: Partial<UsersClass>) {
  try {
    await connectDB();
    const user = await User.updateOne({ _id: values._id }, { $set: values });
    return user;
  } catch (error) {
    return { error };
  }
}
