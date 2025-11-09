import { User } from "@/models/users";
import connectDB from "./connect-db";

export async function getUser(email: string) {
  try {
    await connectDB();
    const user = await User.findOne({
      userEmail: email,
    });
    return user;
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

export async function updateUser(
  height: number,
  weight: number,
  goal: string,
  image: string
) {
  try {
    await connectDB();
    const user = await User.updateOne(
      {
        userEmail: "Janko@manko.sk",
      },
      { $set: { height: height, weight: weight, goal: goal, image: image } }
    );

    return user;
  } catch (error) {
    return { error };
  }
}
