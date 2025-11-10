import { User, UsersClass } from "@/models/users";
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
  height?: number,
  weight?: number,
  goal?: string,
  image?: string,
  email?: string
) {
  try {
    await connectDB();

    const updateFields: Partial<UsersClass> = {};

    if (height !== undefined && height !== null) updateFields.height = height;
    if (weight !== undefined && weight !== null) updateFields.weight = weight;
    if (
      goal === "lose weight" ||
      goal === "gain weight" ||
      goal === "remain same"
    ) {
      updateFields.goal = goal;
    }
    if (image) updateFields.image = image;
    if (email) updateFields.userEmail = email;

    if (Object.keys(updateFields).length === 0) {
      return { message: "No fields to update" };
    }

    const user = await User.updateOne({ $set: updateFields });

    return user;
  } catch (error) {
    return { error };
  }
}
