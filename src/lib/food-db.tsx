import { Todo } from "@/models/Todo";
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

export async function getFood(id: string) {
  try {
    await connectDB();

    const parsedId = stringToObjectId(id);

    if (!parsedId) {
      return { error: "Food not found" };
    }

    const food = await Food.findById(parsedId).lean().exec();
    if (food) {
      return {
        food,
      };
    } else {
      return { error: "Food not found" };
    }
  } catch (error) {
    return { error };
  }
}
