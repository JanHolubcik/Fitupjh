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
    id: 1,
    name: "Oatmeal with fruit",
    amount: "100",
    calories: 300,
    fat: 6,
    protein: 10,
    sugar: 8,
    carbohydrates: 50,
    fiber: 7,
    salt: 0.3,
  },
  {
    id: 2,
    name: "Chicken with rice",
    amount: "200",
    calories: 550,
    fat: 9,
    protein: 35,
    sugar: 3,
    carbohydrates: 70,
    fiber: 3,
    salt: 1,
  },
  {
    id: 3,
    name: "Salad with tuna",
    amount: "150",
    calories: 250,
    fat: 10,
    protein: 20,
    sugar: 4,
    carbohydrates: 15,
    fiber: 5,
    salt: 0.8,
  },
  {
    id: 4,
    name: "Yogurt with granola",
    amount: "120",
    calories: 220,
    fat: 5,
    protein: 12,
    sugar: 12,
    carbohydrates: 28,
    fiber: 3,
    salt: 0.2,
  },
  {
    id: 5,
    name: "Chocolate bar",
    amount: "50",
    calories: 230,
    fat: 13,
    protein: 3,
    sugar: 24,
    carbohydrates: 25,
    fiber: 2,
    salt: 0.1,
  },
  {
    id: 6,
    name: "Sugary soda",
    amount: "330",
    calories: 140,
    fat: 0,
    protein: 0,
    sugar: 35,
    carbohydrates: 35,
    fiber: 0,
    salt: 0.1,
  },
  {
    id: 7,
    name: "Avocado",
    amount: "100",
    calories: 160,
    fat: 15,
    protein: 2,
    sugar: 0.7,
    carbohydrates: 8.5,
    fiber: 6.7,
    salt: 0,
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
  day.setHours(0, 0, 0, 0);
  day.setDate(day.getDate() - indexFromToday);

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
