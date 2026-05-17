// scripts/seedUserMonth.ts
// Run with: npx tsx scripts/seedUserMonth.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = "fitup";
const COLLECTION_NAME = "savedFood";

const USER_ID = "672d160ac4d5fdaecae73afb";
const DAYS_TO_GENERATE = 30;

type FoodItem = {
  id: number;
  name: string;
  calories: number;
  amount: string;
  fat: number;
  protein: number;
  sugar: number;
  carbohydrates: number;
  fiber: number;
  salt: number;
};

type SavedFood = {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
};

// ---------- helpers ----------
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min: number, max: number) =>
  Math.round((Math.random() * (max - min) + min) * 10) / 10;

const pick = <T>(arr: T[]) => arr[randomInt(0, arr.length - 1)];

// ---------- base foods ----------
const baseFoods: FoodItem[] = [
{
  "id":1,
  "name": "Lentils",
  "calories": 116,
  "amount": "150",
  "fat": 0.4,
  "protein": 9,
  "sugar": 1.8,
  "carbohydrates": 20.1,
  "fiber": 7.9,
  "salt": 0
},
 {
  "id": 2,
  "name": "Shrimp",
  "amount": "50",
  "calories": 99,
  "fat": 0.3,
  "protein": 24,
  "sugar": 0,
  "carbohydrates": 0.2,
  "fiber": 0,
  "salt": 0.2
},
{
  "id": 3,
  "name": "Cucumber",
  "amount": "50",
  "calories": 16,
  "fat": 0.1,
  "protein": 0.7,
  "sugar": 1.7,
  "carbohydrates": 3.6,
  "fiber": 0.5,
  "salt": 0
},
  {
    id: 4,
"name": "Walnuts",
"amount": "85",
  "calories": 654,
  "fat": 65.2,
  "protein": 15.2,
  "sugar": 2.6,
  "carbohydrates": 13.7,
  "fiber": 6.7,
  "salt": 0
  },
  {
    id: 5,
  "name": "Banana",
  "calories": 89,
  "amount": "90",
  "fat": 0.3,
  "protein": 1.1,
  "sugar": 12.2,
  "carbohydrates": 22.8,
  "fiber": 2.6,
  "salt": 0
  },
  {
    id: 6,
  "name": "Strawberries",
  "calories": 32,
  "amount": "120",
  "fat": 0.3,
  "protein": 0.7,
  "sugar": 4.9,
  "carbohydrates": 7.7,
  "fiber": 2,
  "salt": 0
  },
  {
    id: 7,
  "name": "Almonds",
  "amount": "100",
  "calories": 579,
  "fat": 49.9,
  "protein": 21.2,
  "sugar": 4.4,
  "carbohydrates": 21.6,
  "fiber": 12.5,
  "salt": 0
  },
];

// ---------- generators ----------
const generateRandomMeal = (
  itemsCount: number,
  sugarBoost: boolean
): FoodItem[] => {
  const meal: FoodItem[] = [];

  for (let i = 0; i < itemsCount; i++) {
    const base = pick(baseFoods);
    const factor = randomFloat(0.8, 1.2);
    meal.push({
      ...base,
      id: randomInt(1, 999999),
      calories: Math.round(base.calories * factor),
      fat: Math.round(base.fat * factor * 10) / 10,
      protein: Math.round(base.protein * factor * 10) / 10,
      sugar: Math.round(base.sugar * factor * 10) / 10,
      carbohydrates: Math.round(base.carbohydrates * factor * 10) / 10,
      fiber: Math.round(base.fiber * factor * 10) / 10,
      salt: Math.round(base.salt * factor * 10) / 10,
    });
  }

  if (sugarBoost) {
    const sugaryItemsCount = randomInt(1, 3);
    for (let i = 0; i < sugaryItemsCount; i++) {
      const sugarBase = pick([baseFoods[4], baseFoods[5]]);
      const factor = randomFloat(1, 1.6);
      meal.push({
        ...sugarBase,
        id: randomInt(1, 999999),
        calories: Math.round(sugarBase.calories * factor),
        fat: Math.round(sugarBase.fat * factor * 10) / 10,
        protein: Math.round(sugarBase.protein * factor * 10) / 10,
        sugar: Math.round(sugarBase.sugar * factor * 10) / 10,
        carbohydrates: Math.round(sugarBase.carbohydrates * factor * 10) / 10,
        fiber: Math.round(sugarBase.fiber * factor * 10) / 10,
        salt: Math.round(sugarBase.salt * factor * 10) / 10,
      });
    }
  }

  return meal;
};

const generateDayDocument = (
  indexFromToday: number
): { day: Date; savedFood: SavedFood; user_id: ObjectId } => {
  const day = new Date();
  day.setUTCHours(0, 0, 0, 0);
  day.setUTCDate(day.getUTCDate() - indexFromToday);

  const isHighSugarDay = Math.random() < 0.3;

  const savedFood: SavedFood = {
    breakfast: generateRandomMeal(
      randomInt(0, 2),
      isHighSugarDay && Math.random() < 0.3
    ),
    lunch: generateRandomMeal(
      randomInt(1, 3),
      isHighSugarDay && Math.random() < 0.6
    ),
    dinner: generateRandomMeal(
      randomInt(1, 3),
      isHighSugarDay && Math.random() < 0.5
    ),
  };

  return { day, savedFood, user_id: new ObjectId(USER_ID) };
};

// ---------- main ----------
const run = async () => {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  console.log(`Seeding ${DAYS_TO_GENERATE} days for user ${USER_ID}...`);

  for (let i = DAYS_TO_GENERATE - 1; i >= 0; i--) {
    const doc = generateDayDocument(i);
    await collection.updateOne(
      { day: doc.day, user_id: doc.user_id }, // match by day + user
      { $set: doc }, // upsert document
      { upsert: true }
    );
  }

  console.log("Seeding complete");
  await client.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
