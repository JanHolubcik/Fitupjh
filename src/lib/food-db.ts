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
      .limit(5)
      .lean()
      .exec();

    if (food) {
      return {
        food: food.map((value) => {
          return {
            name: value.name,
            calories_per_100g: value.calories_per_100g,
            fat: value.fat,
            protein: value.protein,
            sugar: value.sugar,
            carbohydrates: value.carbohydrates,
            fiber: value.fiber,
            salt: value.salt,
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
      user_id: new mongoose.Types.ObjectId(_id),
    });
    if (!existingRecord) {
      await SavedFood.insertMany({
        savedFood: food,
        day: date,
        user_id: new mongoose.Types.ObjectId(_id),
      });
    } else {
      existingRecord.savedFood = food;
      await existingRecord.save();
    }
  } catch (error) {
    return { error };
  }
}

export async function checkForSavedFood(date: string, user_id: string) {
  try {
    await connectDB();

    const existingRecord = await SavedFood.findOne({
      day: date,
      user_id: new mongoose.Types.ObjectId(user_id),
    });

    return existingRecord ? { savedFood: existingRecord.savedFood } : {};
  } catch (error) {
    return { error };
  }
}
