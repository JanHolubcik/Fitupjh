// scripts/seed-foods.ts
// Run with: npx tsx scripts/seed-foods.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = "fitup";
const FOOD_COLLECTION = "food";

// Clean names, highly accurate USDA macros per 100g
const foodData = [
  // --- GRAINS & STARCHES ---
  {
    name: "White Rice",
    localized: "Biela ryža",
    calories_per_100g: 360,
    protein: 7.0,
    carbohydrates: 80.0,
    sugar: 0.1,
    fat: 0.6,
    fiber: 1.3,
    salt: 0.01,
  },
  {
    name: "Brown Rice",
    localized: "Hnedá ryža",
    calories_per_100g: 367,
    protein: 7.5,
    carbohydrates: 76.0,
    sugar: 0.6,
    fat: 2.8,
    fiber: 3.4,
    salt: 0.01,
  },
  {
    name: "Oats",
    localized: "Ovsené vločky",
    calories_per_100g: 379,
    protein: 13.0,
    carbohydrates: 68.0,
    sugar: 1.0,
    fat: 6.5,
    fiber: 10.0,
    salt: 0.01,
  },
  {
    name: "Quinoa",
    localized: "Quinoa",
    calories_per_100g: 368,
    protein: 14.0,
    carbohydrates: 64.0,
    sugar: 0.0,
    fat: 6.0,
    fiber: 7.0,
    salt: 0.01,
  },
  {
    name: "Pasta",
    localized: "Cestoviny",
    calories_per_100g: 350,
    protein: 12.0,
    carbohydrates: 71.0,
    sugar: 3.0,
    fat: 1.5,
    fiber: 3.0,
    salt: 0.02,
  },
  {
    name: "Potatoes",
    localized: "Zemiaky",
    calories_per_100g: 77,
    protein: 2.0,
    carbohydrates: 17.0,
    sugar: 0.8,
    fat: 0.1,
    fiber: 2.2,
    salt: 0.01,
  },
  {
    name: "Sweet Potatoes",
    localized: "Batáty",
    calories_per_100g: 86,
    protein: 1.6,
    carbohydrates: 20.0,
    sugar: 4.2,
    fat: 0.1,
    fiber: 3.0,
    salt: 0.14,
  },
  {
    name: "Bread",
    localized: "Chlieb",
    calories_per_100g: 265,
    protein: 9.0,
    carbohydrates: 49.0,
    sugar: 5.0,
    fat: 3.2,
    fiber: 2.7,
    salt: 1.1,
  },

  // --- PROTEINS (MEAT & EGGS) ---
  {
    name: "Chicken Breast",
    localized: "Kuracie prsia",
    calories_per_100g: 120,
    protein: 22.5,
    carbohydrates: 0.0,
    sugar: 0.0,
    fat: 2.6,
    fiber: 0.0,
    salt: 0.11,
  },
  {
    name: "Chicken Thighs",
    localized: "Kuracie stehná",
    calories_per_100g: 177,
    protein: 17.0,
    carbohydrates: 0.0,
    sugar: 0.0,
    fat: 12.0,
    fiber: 0.0,
    salt: 0.2,
  },
  {
    name: "Beef Minced",
    localized: "Hovädzie mleté",
    calories_per_100g: 250,
    protein: 26.0,
    carbohydrates: 0.0,
    sugar: 0.0,
    fat: 15.0,
    fiber: 0.0,
    salt: 0.18,
  },
  {
    name: "Pork Loin",
    localized: "Bravčové karé",
    calories_per_100g: 143,
    protein: 21.0,
    carbohydrates: 0.0,
    sugar: 0.0,
    fat: 6.0,
    fiber: 0.0,
    salt: 0.1,
  },
  {
    name: "Salmon",
    localized: "Losos",
    calories_per_100g: 208,
    protein: 20.0,
    carbohydrates: 0.0,
    sugar: 0.0,
    fat: 13.0,
    fiber: 0.0,
    salt: 0.11,
  },
  {
    name: "Tuna",
    localized: "Tuniak",
    calories_per_100g: 130,
    protein: 28.0,
    carbohydrates: 0.0,
    sugar: 0.0,
    fat: 1.0,
    fiber: 0.0,
    salt: 0.8,
  },
  {
    name: "Eggs",
    localized: "Vajcia",
    calories_per_100g: 143,
    protein: 12.6,
    carbohydrates: 0.7,
    sugar: 0.2,
    fat: 9.5,
    fiber: 0.0,
    salt: 0.35,
  },
  {
    name: "Egg Whites",
    localized: "Vaječné bielka",
    calories_per_100g: 52,
    protein: 11.0,
    carbohydrates: 0.7,
    sugar: 0.7,
    fat: 0.2,
    fiber: 0.0,
    salt: 0.4,
  },

  // --- DAIRY & ALTERNATIVES ---
  {
    name: "Milk",
    localized: "Mlieko",
    calories_per_100g: 47,
    protein: 3.4,
    carbohydrates: 4.9,
    sugar: 4.9,
    fat: 1.5,
    fiber: 0.0,
    salt: 0.1,
  },
  {
    name: "Greek Yogurt",
    localized: "Grécky jogurt",
    calories_per_100g: 59,
    protein: 10.0,
    carbohydrates: 3.6,
    sugar: 3.6,
    fat: 0.4,
    fiber: 0.0,
    salt: 0.1,
  },
  {
    name: "Cottage Cheese",
    localized: "Cottage syr",
    calories_per_100g: 84,
    protein: 11.0,
    carbohydrates: 4.3,
    sugar: 2.7,
    fat: 2.3,
    fiber: 0.0,
    salt: 0.8,
  },
  {
    name: "Cheddar Cheese",
    localized: "Čedar",
    calories_per_100g: 402,
    protein: 25.0,
    carbohydrates: 1.3,
    sugar: 0.5,
    fat: 33.0,
    fiber: 0.0,
    salt: 1.8,
  },
  {
    name: "Mozzarella",
    localized: "Mozzarella",
    calories_per_100g: 300,
    protein: 22.0,
    carbohydrates: 2.2,
    sugar: 1.0,
    fat: 22.0,
    fiber: 0.0,
    salt: 1.5,
  },
  {
    name: "Butter",
    localized: "Maslo",
    calories_per_100g: 717,
    protein: 0.8,
    carbohydrates: 0.1,
    sugar: 0.1,
    fat: 81.0,
    fiber: 0.0,
    salt: 0.02,
  },

  // --- VEGETABLES ---
  {
    name: "Broccoli",
    localized: "Brokolica",
    calories_per_100g: 34,
    protein: 2.8,
    carbohydrates: 6.6,
    sugar: 1.7,
    fat: 0.4,
    fiber: 2.6,
    salt: 0.08,
  },
  {
    name: "Spinach",
    localized: "Špenát",
    calories_per_100g: 23,
    protein: 2.9,
    carbohydrates: 3.6,
    sugar: 0.4,
    fat: 0.4,
    fiber: 2.2,
    salt: 0.2,
  },
  {
    name: "Carrots",
    localized: "Mrkva",
    calories_per_100g: 41,
    protein: 0.9,
    carbohydrates: 9.6,
    sugar: 4.7,
    fat: 0.2,
    fiber: 2.8,
    salt: 0.17,
  },
  {
    name: "Onion",
    localized: "Cibuľa",
    calories_per_100g: 40,
    protein: 1.1,
    carbohydrates: 9.3,
    sugar: 4.2,
    fat: 0.1,
    fiber: 1.7,
    salt: 0.01,
  },
  {
    name: "Garlic",
    localized: "Cesnak",
    calories_per_100g: 149,
    protein: 6.4,
    carbohydrates: 33.0,
    sugar: 1.0,
    fat: 0.5,
    fiber: 2.1,
    salt: 0.04,
  },
  {
    name: "Tomatoes",
    localized: "Paradajky",
    calories_per_100g: 18,
    protein: 0.9,
    carbohydrates: 3.9,
    sugar: 2.6,
    fat: 0.2,
    fiber: 1.2,
    salt: 0.01,
  },
  {
    name: "Bell Pepper",
    localized: "Paprika",
    calories_per_100g: 31,
    protein: 1.0,
    carbohydrates: 6.0,
    sugar: 4.2,
    fat: 0.3,
    fiber: 2.1,
    salt: 0.01,
  },
  {
    name: "Cucumber",
    localized: "Uhorka",
    calories_per_100g: 15,
    protein: 0.6,
    carbohydrates: 3.6,
    sugar: 1.7,
    fat: 0.1,
    fiber: 0.5,
    salt: 0.01,
  },
  {
    name: "Zucchini",
    localized: "Cuketa",
    calories_per_100g: 17,
    protein: 1.2,
    carbohydrates: 3.1,
    sugar: 2.5,
    fat: 0.3,
    fiber: 1.0,
    salt: 0.02,
  },

  // --- FRUITS ---
  {
    name: "Banana",
    localized: "Banán",
    calories_per_100g: 89,
    protein: 1.1,
    carbohydrates: 23.0,
    sugar: 12.0,
    fat: 0.3,
    fiber: 2.6,
    salt: 0.0,
  },
  {
    name: "Apple",
    localized: "Jablko",
    calories_per_100g: 52,
    protein: 0.3,
    carbohydrates: 14.0,
    sugar: 10.0,
    fat: 0.2,
    fiber: 2.4,
    salt: 0.0,
  },
  {
    name: "Strawberries",
    localized: "Jahody",
    calories_per_100g: 32,
    protein: 0.7,
    carbohydrates: 7.7,
    sugar: 4.9,
    fat: 0.3,
    fiber: 2.0,
    salt: 0.0,
  },
  {
    name: "Blueberries",
    localized: "Čučoriedky",
    calories_per_100g: 57,
    protein: 0.7,
    carbohydrates: 14.0,
    sugar: 10.0,
    fat: 0.3,
    fiber: 2.4,
    salt: 0.0,
  },
  {
    name: "Oranges",
    localized: "Pomaranč",
    calories_per_100g: 47,
    protein: 0.9,
    carbohydrates: 12.0,
    sugar: 9.0,
    fat: 0.1,
    fiber: 2.4,
    salt: 0.0,
  },
  {
    name: "Grapes",
    localized: "Hrozno",
    calories_per_100g: 69,
    protein: 0.7,
    carbohydrates: 18.0,
    sugar: 15.0,
    fat: 0.2,
    fiber: 0.9,
    salt: 0.0,
  },
  {
    name: "Avocado",
    localized: "Avokádo",
    calories_per_100g: 160,
    protein: 2.0,
    carbohydrates: 8.5,
    sugar: 0.7,
    fat: 15.0,
    fiber: 6.7,
    salt: 0.02,
  },
  {
    name: "Lemon",
    localized: "Citrón",
    calories_per_100g: 29,
    protein: 1.1,
    carbohydrates: 9.3,
    sugar: 2.5,
    fat: 0.3,
    fiber: 2.8,
    salt: 0.0,
  },

  // --- NUTS, SEEDS & OILS ---
  {
    name: "Almonds",
    localized: "Mandle",
    calories_per_100g: 579,
    protein: 21.0,
    carbohydrates: 22.0,
    sugar: 4.4,
    fat: 50.0,
    fiber: 12.0,
    salt: 0.0,
  },
  {
    name: "Walnuts",
    localized: "Vlašské orechy",
    calories_per_100g: 654,
    protein: 15.0,
    carbohydrates: 14.0,
    sugar: 2.6,
    fat: 65.0,
    fiber: 6.7,
    salt: 0.0,
  },
  {
    name: "Peanut Butter",
    localized: "Arašidové maslo",
    calories_per_100g: 588,
    protein: 25.0,
    carbohydrates: 20.0,
    sugar: 4.7,
    fat: 50.0,
    fiber: 6.0,
    salt: 0.04,
  },
  {
    name: "Olive Oil",
    localized: "Olivový olej",
    calories_per_100g: 884,
    protein: 0.0,
    carbohydrates: 0.0,
    sugar: 0.0,
    fat: 100.0,
    fiber: 0.0,
    salt: 0.0,
  },
  {
    name: "Chia Seeds",
    localized: "Chia semienka",
    calories_per_100g: 486,
    protein: 17.0,
    carbohydrates: 42.0,
    sugar: 0.0,
    fat: 31.0,
    fiber: 34.0,
    salt: 0.04,
  },

  // --- EXTRAS ---
  {
    name: "Honey",
    localized: "Med",
    calories_per_100g: 304,
    protein: 0.3,
    carbohydrates: 82.0,
    sugar: 82.0,
    fat: 0.0,
    fiber: 0.2,
    salt: 0.01,
  },
  {
    name: "Dark Chocolate",
    localized: "Horká čokoláda",
    calories_per_100g: 598,
    protein: 7.8,
    carbohydrates: 46.0,
    sugar: 24.0,
    fat: 43.0,
    fiber: 11.0,
    salt: 0.05,
  },
];

const run = async () => {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(FOOD_COLLECTION);

    console.log("Connected successfully.");
    console.log(`Preparing to seed ${foodData.length} food items...`);

    // Prepare operations for the native driver
    const bulkOps = foodData.map((item) => {
      // Build standard JS object for translations
      const localizedNames: Record<string, string> = {};
      if (item.localized) {
        localizedNames["sk"] = item.localized;
      }

      return {
        updateOne: {
          filter: { name: item.name },
          update: {
            $set: {
              name: item.name,
              localizedNames: localizedNames,
              calories_per_100g: item.calories_per_100g,
              fat: item.fat,
              protein: item.protein,
              sugar: item.sugar,
              carbohydrates: item.carbohydrates,
              fiber: item.fiber,
              salt: item.salt,
              updatedAt: new Date(),
            },
            $setOnInsert: {
              createdAt: new Date(),
            },
          },
          upsert: true,
        },
      };
    });

    const result = await collection.bulkWrite(bulkOps);

    console.log("Seeding complete!");
    console.log(
      `Added: ${result.upsertedCount}, Updated: ${result.modifiedCount}`,
    );
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB.");
  }
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
