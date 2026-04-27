import { foodType } from "@/types/Types";
import connectDB from "./connect-db";
import { stringToObjectId } from "./utils";
import { Food } from "@/models/Food";
import { SavedFood } from "@/models/savedFood";
import mongoose from "mongoose";
import { FoodInput } from "./validationShemas/foodValidationSchema";

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

/**
 *  Saving food after user adds it.
 * @param date 
 * @param food 
 * @param _id 
 * @returns Error.
 */
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

export async function addNewFood(newFood: FoodInput) {
  try {
    await connectDB();


    const existingRecord = await Food.findOne({
      name: { $regex: new RegExp(`^${newFood.name}$`, "i") } //handling use case sensitivity
    });

    if (existingRecord) {
      return { success: false, error: "This food item already exists." };
    }


    const insertedNew = await Food.create({
      name: newFood.name,
      protein: newFood.protein,
      sugar: newFood.sugar,
      fat: newFood.fat,
      carbohydrates: newFood.carbohydrates,
      salt: newFood.salt,
      calories_per_100g: newFood.calories_per_100g,
      fiber: 0
    });

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(insertedNew)) 
    };

  } catch (error) {
    console.error("Database Error:", error);
    return { 
      success: false, 
      error: "An unexpected error occurred while saving." 
    };
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

export async function checkForSavedFoodMonth(
  dateFrom: string,
  dateTo: string,
  user_id: string
) {
  try {
    await connectDB();

    const existingRecords = await SavedFood.find({
      user_id: { $exists: true, $eq: new mongoose.Types.ObjectId(user_id) },
      day: { $gte: new Date(dateFrom), $lte: new Date(dateTo) },
    }).lean();

    if (!existingRecords.length) return {};

    return existingRecords;
  } catch (error) {
    return { error };
  }
}
