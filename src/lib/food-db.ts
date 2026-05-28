import { foodType } from "@/types/Types";
import connectDB from "./connect-db";
import { Food, FoodClass } from "@/models/Food";
import { SavedFood } from "@/models/savedFood";
import mongoose from "mongoose";
import { FoodInput } from "./validationShemas/foodValidationSchema";
import { format } from "date-fns";

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
            imgUrl: value.imgUrl,
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
 * Retrieves a food item by its QR code.
 * @param qrCode
 * @returns
 */
export async function getFoodByQR(qrCode: string) {
  try {
    await connectDB();

    const food = await Food.findOne({ QRcode: qrCode })
      .lean<FoodClass>()
      .exec();

    if (!food) {
      return { error: "Food not found" };
    }

    return {
      name: food.name,
      calories_per_100g: food.calories_per_100g,
      fat: food.fat,
      protein: food.protein,
      sugar: food.sugar,
      carbohydrates: food.carbohydrates,
      fiber: food.fiber,
      salt: food.salt,
      qrCode: food.QRcode,
      ProductWeight: food.ProductWeight,
      imgUrl: food.imgUrl,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unknown database error occurred",
    };
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
  _id: mongoose.Types.ObjectId | string,
) {
  try {
    await connectDB();

    const existingRecord = await SavedFood.findOneAndUpdate(
      {
        day: date,
        user_id: new mongoose.Types.ObjectId(_id),
      },
      {
        $set: {
          saveFood: food,
        },
        $setOnInsert: {
          day: date,
          user_id: new mongoose.Types.ObjectId(_id),
        },
      },
      { upsert: true, new: true },
    );
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
    return existingRecord;
  } catch (error) {
    return { error };
  }
}

export async function addNewFood(newFood: FoodInput) {
  try {
    await connectDB();

    const existingRecord = await Food.findOne({
      name: { $regex: new RegExp(`^${newFood.name}$`, "i") }, //handling use case sensitivity
    });

    if (existingRecord) {
      return { success: false, error: "This food item already exists." };
    }

    const insertedNew: FoodClass = await Food.create({
      name: newFood.name,
      protein: newFood.protein,
      sugar: newFood.sugar,
      fat: newFood.fat,
      carbohydrates: newFood.carbohydrates,
      salt: newFood.salt,
      calories_per_100g: newFood.calories_per_100g,
      fiber: 0,
      QRcode: newFood.barcode,
      imgUrl: newFood.imgUrl,
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(insertedNew)),
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      error: "An unexpected error occurred while saving.",
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
  user_id: string,
) {
  try {
    await connectDB();

    const existingRecords = await SavedFood.find({
      user_id: { $exists: true, $eq: new mongoose.Types.ObjectId(user_id) },
      day: { $gte: new Date(dateFrom), $lte: new Date(dateTo) },
    }).lean();

    const recordMap = new Map<string, any>();
    existingRecords.forEach((record) => {
      const dateStr = new Date(record.day).toISOString().split("T")[0];
      recordMap.set(dateStr, record);
    });

    const completeRecords: any[] = [];

    const start = new Date(dateFrom);
    const end = new Date(dateTo);

    const current = new Date(start);

    while (current <= end) {
      const dateStr = current.toISOString().split("T")[0];

      if (recordMap.has(dateStr)) {
        completeRecords.push(recordMap.get(dateStr));
      } else {
        completeRecords.push({
          _id: new mongoose.Types.ObjectId(), // Generate a fake ID to match schema expectations
          user_id: new mongoose.Types.ObjectId(user_id),
          day: format(new Date(), "yyyy-MM-dd"),
          savedFood: {
            breakfast: [],
            lunch: [],
            dinner: [],
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Move to the next day
      current.setDate(current.getDate() + 1);
    }

    if (!existingRecords.length) return {};

    return existingRecords;
  } catch (error) {
    return { error };
  }
}
