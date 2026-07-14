import { FoodType } from "@/types/Types";
import connectDB from "./connect-db";
import { Food, FoodClass } from "@/lib/mongo/models/Food";
import { SavedFood } from "@/lib/mongo/models/SavedFood";
import mongoose from "mongoose";
import { FoodInput } from "../validationShemas/foodValidationSchema";
import { addDays, format, parse } from "date-fns";

export async function getFoods() {
  await connectDB();

  const food = await Food.find().lean().exec();

  const results = food.length;

  return {
    food: food,
    results,
  };
}

export async function getFood(substring: string, language?: string) {
  await connectDB();

  const escapedSubstring = substring.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regexString = ".*" + escapedSubstring + ".*";
  const regexPattern = new RegExp(regexString, "i");

  let pipeline: mongoose.PipelineStage[] = [];

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
}

/**
 * Retrieves a food item by its Barcode code.
 * @param Barcode
 * @returns
 */
export async function getFoodByBarcode(Barcode: string) {
  await connectDB();
  //TODO:yes it says qrcode, I should probably write script to change this
  const food = await Food.findOne({ QRcode: Barcode })
    .lean<FoodClass>()
    .exec();

  if (!food) {
    return null;
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
}

/**
 *  Saving food after user adds it.
 * @param date
 * @param food
 * @param _id
 * @returns
 */
export async function saveFoodInDay(
  date: string,
  food: FoodType,
  _id: mongoose.Types.ObjectId | string,
) {
  await connectDB();

  const existingRecord = await SavedFood.findOneAndUpdate(
    {
      day: date,
      user_id: new mongoose.Types.ObjectId(_id),
    },
    {
      $set: {
        savedFood: food,
      },
      $setOnInsert: {
        day: date,
        user_id: new mongoose.Types.ObjectId(_id),
      },
    },
    { upsert: true, new: true },
  );

  return existingRecord;
}

export async function addNewFood(newFood: FoodInput) {
  await connectDB();
  //escapes characters which could be interpreted as regex
  const escapedName = newFood.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const existingRecord = await Food.findOne({
    name: { $regex: new RegExp(`^${escapedName}$`, "i") }, //handling use case sensitivity
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
}

export async function checkForSavedFood(date: string, user_id: string) {
  await connectDB();

  const existingRecord = await SavedFood.findOne({
    day: date,
    user_id: new mongoose.Types.ObjectId(user_id),
  });

  return existingRecord ? { savedFood: existingRecord.savedFood } : {};
}

export async function checkForSavedFoodMonth(
  dateFrom: string,
  dateTo: string,
  user_id: string,
) {
  await connectDB();

  const existingRecords = await SavedFood.find({
    user_id: new mongoose.Types.ObjectId(user_id),
    day: { $gte: dateFrom, $lte: dateTo },
  }).lean();

  const recordMap = new Map<string, (typeof existingRecords)[number]>();
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
}

export async function getFoodsPaginated(
  search?: string,
  page: number = 1,
  limit: number = 6
): Promise<{ foods: any[]; total: number }> {
  await connectDB();

  const query: Record<string, any> = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { QRcode: { $regex: search, $options: "i" } },
    ];
  }

  const total = await Food.countDocuments(query);
  const skip = (page - 1) * limit;

  const foods = await Food.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();

  return {
    foods: JSON.parse(JSON.stringify(foods)),
    total,
  };
}

export async function updateFood(
  foodId: string,
  data: Partial<FoodInput>
): Promise<boolean> {
  await connectDB();

  if (data.name) {
    const escapedName = data.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const existing = await Food.findOne({
      name: { $regex: new RegExp(`^${escapedName}$`, "i") },
      _id: { $ne: new mongoose.Types.ObjectId(foodId) },
    }).lean();
    if (existing) {
      throw new Error("name_conflict");
    }
  }

  const updateFields: Record<string, any> = {};
  if (data.name !== undefined) updateFields.name = data.name;
  if (data.protein !== undefined) updateFields.protein = data.protein;
  if (data.sugar !== undefined) updateFields.sugar = data.sugar;
  if (data.fat !== undefined) updateFields.fat = data.fat;
  if (data.carbohydrates !== undefined) updateFields.carbohydrates = data.carbohydrates;
  if (data.salt !== undefined) updateFields.salt = data.salt;
  if (data.calories_per_100g !== undefined) updateFields.calories_per_100g = data.calories_per_100g;
  if (data.fiber !== undefined) updateFields.fiber = data.fiber;
  if (data.barcode !== undefined) updateFields.QRcode = data.barcode;
  if (data.imgUrl !== undefined) updateFields.imgUrl = data.imgUrl;
  if (data.ProductWeight !== undefined) updateFields.ProductWeight = data.ProductWeight;

  const result = await Food.updateOne(
    { _id: new mongoose.Types.ObjectId(foodId) },
    { $set: updateFields }
  );

  return result.modifiedCount > 0 || result.matchedCount > 0;
}

export async function deleteFood(foodId: string): Promise<boolean> {
  await connectDB();

  const result = await Food.deleteOne({
    _id: new mongoose.Types.ObjectId(foodId),
  });

  return result.deletedCount > 0;
}

