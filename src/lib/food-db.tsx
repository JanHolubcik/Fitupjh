import connectDB from "./connect-db";
import { stringToObjectId } from "./utils";
import { Food } from "@/models/Food";

export async function getFoods() {
  try {
    await connectDB();

    const food = await Food.find().lean().exec();

    const results = food.length;

    return {
      food: food,
      results,
    };
  } catch (error) {
    return { error };
  }
}

export async function getFood(substring: string) {
  try {
    await connectDB();

    const food = await Food.find({
      name: { $regex: ".*" + substring + ".*", $options: "i" },
    })
      .lean()
      .exec();

    if (food) {
      return {
        food: food,
      };
    } else {
      return { error: "Food not found" };
    }
  } catch (error) {
    return { error };
  }
}
