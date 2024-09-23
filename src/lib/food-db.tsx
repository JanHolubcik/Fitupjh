import { foodType } from "@/types/foodTypes";
import connectDB from "./connect-db";
import { stringToObjectId } from "./utils";
import { Food } from "@/models/Food";
import { SavedFood } from "@/models/savedFood";

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

export async function saveFoodInDay(date: Date, food: foodType) {
  try {
    await connectDB();

    const existingRecord = await SavedFood.findOne({
      day: date,
    });
    if (!existingRecord) {
      console.log("Creating new food record...");
      await SavedFood.insertMany({
        savedFood: food,
        day: date,
      });
    } else {
      existingRecord.savedFood = food;
      console.log("Updating food record...");
      await existingRecord.save();
    }
  } catch (error) {
    console.log(error);
    return { error };
  }
}

export async function checkForSavedFood(date: string) {
  try {
    await connectDB();

    const existingRecord = await SavedFood.findOne({
      day: date,
    });

    return existingRecord ? { savedFood: existingRecord.savedFood } : {};
  } catch (error) {
    console.log(error);
    return { error };
  }
}
