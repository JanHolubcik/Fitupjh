// scripts/seedUserMonth.ts
// Run with: npx tsx scripts/seedUserMonth.ts
import { format, subDays } from "date-fns";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = "fitup";
const SAVED_FOOD_COLLECTION = "savedFood";
const FOOD_COLLECTION = "food";

const USER_ID = "";
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
  imgUrl?: string;
  originalName?: string;
};

type SavedFood = {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
};

// ---------- helpers ----------
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T>(arr: T[]) => arr[randomInt(0, arr.length - 1)];

// ---------- map DB food → FoodItem with a random gram amount ----------
const mapToFoodItem = (dbFood: any): FoodItem => {
  const amount = randomInt(80, 300);
  const factor = amount / 100;
  return {
    id: randomInt(1, 999999),
    name: dbFood.name,
    amount: amount.toString(),
    calories: Math.round((dbFood.calories_per_100g ?? 0) * factor),
    fat: Math.round((dbFood.fat ?? 0) * factor * 10) / 10,
    protein: Math.round((dbFood.protein ?? 0) * factor * 10) / 10,
    sugar: Math.round((dbFood.sugar ?? 0) * factor * 10) / 10,
    carbohydrates: Math.round((dbFood.carbohydrates ?? 0) * factor * 10) / 10,
    fiber: Math.round((dbFood.fiber ?? 0) * factor * 10) / 10,
    salt: Math.round((dbFood.salt ?? 0) * factor * 10) / 10,
    imgUrl: dbFood.imgUrl ?? "",
    originalName: dbFood.originalName,
  };
};

const isVegetableOrFruitOrAllowed = (name: string): boolean => {
  const lowercaseName = name.toLowerCase();
  
  // Explicit allowed items
  const allowedItems = ["tuna", "salmon", "chicken thigh"];
  if (allowedItems.some(item => lowercaseName.includes(item))) {
    return true;
  }

  // Fruit names/keywords (case insensitive, sub-strings)
  const fruits = [
    "banana", "orange", "strawberry", "strawberries", "pineapple", "blueberry", "blueberries",
    "apple", "avocado", "grape", "grapes", "lemon", "peach", "pear", "raspberry", "raspberries",
    "watermelon", "kiwi", "mango", "plum", "cherry", "cherries", "apricot", "grapefruit", "melon",
    "cranberries"
  ];
  if (fruits.some(fruit => lowercaseName.includes(fruit))) {
    return true;
  }

  // Vegetable names/keywords
  const vegetables = [
    "cucumber", "spinach", "broccoli", "tomato", "tomatoes", "carrot", "carrots",
    "zucchini", "potato", "potatoes", "onion", "garlic", "bell pepper", "pepper", "cauliflower",
    "cabbage", "mushroom", "mushrooms", "sweet corn", "corn", "peas", "pumpkin"
  ];
  if (vegetables.some(veg => lowercaseName.includes(veg))) {
    return true;
  }

  return false;
};

const generateMeal = (foods: any[], count: number): FoodItem[] =>
  Array.from({ length: count }, () => mapToFoodItem(pick(foods)));

const generateDayDocument = (
  indexFromToday: number,
  foods: any[],
): { day: string; savedFood: SavedFood; user_id: ObjectId } => {
  const day = format(subDays(new Date(), indexFromToday), "yyyy-MM-dd");

  let availableFoods = foods;
  if (indexFromToday < 4) {
    availableFoods = foods.filter((f) => isVegetableOrFruitOrAllowed(f.name));
  }

  return {
    day,
    user_id: new ObjectId(USER_ID),
    savedFood: {
      breakfast: generateMeal(availableFoods, randomInt(0, 2)),
      lunch: generateMeal(availableFoods, randomInt(1, 3)),
      dinner: generateMeal(availableFoods, randomInt(1, 3)),
    },
  };
};

// ---------- main ----------
const run = async () => {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  const foods = await db.collection(FOOD_COLLECTION).find({}).toArray();
  if (foods.length === 0) {
    console.error("No foods found in the food collection. Aborting.");
    await client.close();
    process.exit(1);
  }
  console.log(`Loaded ${foods.length} foods from DB.`);

  const collection = db.collection(SAVED_FOOD_COLLECTION);
  console.log(`Seeding ${DAYS_TO_GENERATE} days for user ${USER_ID}...`);

  for (let i = DAYS_TO_GENERATE - 1; i >= 0; i--) {
    const doc = generateDayDocument(i, foods);
    await collection.updateOne(
      { day: doc.day, user_id: doc.user_id },
      { $set: doc },
      { upsert: true },
    );
  }

  console.log("Seeding complete.");
  await client.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
