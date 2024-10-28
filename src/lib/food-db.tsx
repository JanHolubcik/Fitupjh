import { foodType } from "@/types/foodTypes";
import connectDB from "./connect-db";
import { stringToObjectId } from "./utils";
import { Food } from "@/models/Food";
import { SavedFood } from "@/models/savedFood";
import mongoose from "mongoose";

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
        food: food.map((value) => {
          return {
            name: value.name,
            calories_per_100g: value.calories_per_100g,
          };
        }),
      };
    } else {
      return { error: "Food not found" };
    }
  } catch (error) {
    return { error };
  }
}

export async function saveFoodInDay(
  date: string,
  food: foodType,
  _id: mongoose.Types.ObjectId | string
) {
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
        user_id: _id,
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

export async function checkForSavedFood(date: string, user_id: string) {
  try {
    await connectDB();

    const existingRecord = await SavedFood.findOne({
      day: date,
      user_id: user_id,
    });

    return existingRecord ? { savedFood: existingRecord.savedFood } : {};
  } catch (error) {
    console.log(error);
    return { error };
  }
}
