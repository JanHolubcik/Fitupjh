import { FoodType } from "@/types/Types";
import connectDB from "./connect-db";
import { Food, FoodClass } from "@/lib/mongo/models/Food";
import { SavedFood } from "@/lib/mongo/models/SavedFood";
import mongoose from "mongoose";
import { FoodInput } from "../validationShemas/foodValidationSchema";
import { addDays, format, parse } from "date-fns";

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

export async function getFood(substring: string, language?: string) {
  try {
    await connectDB();

    const escapedSubstring = substring.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regexString = ".*" + escapedSubstring + ".*";
    const regexPattern = new RegExp(regexString, "i");

    let pipeline: any[] = [];

    if (language) {
      const localizedKey = `localizedNames.${language}`;

      pipeline = [
        {
          $match: {
            $or: [{ name: regexPattern }, { [localizedKey]: regexPattern }],
          },
        },
        {
          $addFields: {
            isLocalMatch: {
              $regexMatch: {
                input: { $ifNull: [`$${localizedKey}`, ""] },
                regex: regexString,
                options: "i",
              },
            },
            displayLabel: {
              $ifNull: [`$${localizedKey}`, "$name"],
            },
          },
        },

        {
          $sort: {
            isLocalMatch: -1, // -1 means descending (true/1 comes before false/0)
            displayLabel: 1, // 1 means ascending (A-Z)
          },
        },

        {
          $limit: 7,
        },
      ];
    } else {
      pipeline = [
        { $match: { name: regexPattern } },
        { $addFields: { displayLabel: "$name" } },
        { $sort: { displayLabel: 1 } },
        { $limit: 7 },
      ];
    }

    const food = await Food.aggregate(pipeline).exec();

    if (food && food.length > 0) {
      return {
        food: food.map((value) => {
          return {
            name: value.displayLabel,
            originalName: value.name,
            calories_per_100g: value.calories_per_100g,
            fat: value.fat,
            protein: value.protein,
            sugar: value.sugar,
            carbohydrates: value.carbohydrates,
            fiber: value.fiber,
            salt: value.salt,
            imgUrl: value.imgUrl,
            ProductWeight: value.ProductWeight,
            qrCode: value.QRcode,
            localizedNames: value.localizedNames,
          };
        }),
      };
    } else {
      return { food: [] };
    }
  } catch (error) {
    return { error };
  }
}
/**
 * Retrieves a food item by its Barcode code.
 * @param Barcode
 * @returns
 */
export async function getFoodByBarcode(Barcode: string) {
  try {
    await connectDB();
    //TODO:yes it says qrcode, I should probably write script to change this
    const food = await Food.findOne({ QRcode: Barcode })
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
  food: FoodType,
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
      ProductWeight: newFood.ProductWeight,
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
      user_id: new mongoose.Types.ObjectId(user_id),
      day: { $gte: dateFrom, $lte: dateTo },
    }).lean();

    const recordMap = new Map<string, any>();
    existingRecords.forEach((record) => {
      recordMap.set(record.day.toString(), record);
    });

    const foodMonth: Record<string, FoodType> = {};

    let currentParsedDate = parse(dateFrom, "yyyy-MM-dd", new Date());
    const endParsedDate = parse(dateTo, "yyyy-MM-dd", new Date());

    while (currentParsedDate <= endParsedDate) {
      const dateStr = format(currentParsedDate, "yyyy-MM-dd");

      if (recordMap.has(dateStr)) {
        foodMonth[dateStr] = recordMap.get(dateStr)!.savedFood as FoodType;
      } else {
        foodMonth[dateStr] = {
          breakfast: [],
          lunch: [],
          dinner: [],
        };
      }

      currentParsedDate = addDays(currentParsedDate, 1);
    }

    return foodMonth;
  } catch (error) {
    console.error("Error in checkForSavedFoodMonth:", error);
    return { error };
  }
}
