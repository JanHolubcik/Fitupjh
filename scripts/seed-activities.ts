// scripts/seed-activities.ts
// Run with: npx tsx scripts/seed-activities.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = "fitup";
const ACTIVITY_COLLECTION = "activities";

const activityData = [
  // --- CARDIO ---
  {
    name: "Walking (Brisk)",
    localized: "Chôdza (svižná)",
    metValue: 3.8,
    category: "Cardio",
  },
  {
    name: "Running (Moderate)",
    localized: "Beh (stredné tempo)",
    metValue: 9.8,
    category: "Cardio",
  },
  {
    name: "Cycling (Moderate)",
    localized: "Bicyklovanie (stredné)",
    metValue: 7.5,
    category: "Cardio",
  },
  {
    name: "Swimming (Freestyle)",
    localized: "Plávanie (kraul)",
    metValue: 5.8,
    category: "Cardio",
  },
  {
    name: "Jump Rope",
    localized: "Skákanie cez švihadlo",
    metValue: 10.0,
    category: "Cardio",
  },
  {
    name: "Rowing Machine",
    localized: "Veslovací trenažér",
    metValue: 6.0,
    category: "Cardio",
  },

  // --- STRENGTH & FLEXIBILITY ---
  {
    name: "Weightlifting (General)",
    localized: "Posilňovanie (bežné)",
    metValue: 3.5,
    category: "Strength",
  },
  {
    name: "Weightlifting (Vigorous)",
    localized: "Posilňovanie (intenzívne)",
    metValue: 6.0,
    category: "Strength",
  },
  {
    name: "Bodyweight Exercises",
    localized: "Cvičenie s vlastnou váhou",
    metValue: 4.3,
    category: "Strength",
  },
  {
    name: "Yoga",
    localized: "Joga",
    metValue: 2.5,
    category: "Flexibility",
  },
  {
    name: "Pilates",
    localized: "Pilates",
    metValue: 3.0,
    category: "Flexibility",
  },
  {
    name: "Stretching",
    localized: "Strečing",
    metValue: 2.3,
    category: "Flexibility",
  },

  // --- SPORTS & RECREATION ---
  {
    name: "Soccer (Competitive)",
    localized: "Futbal (zápas)",
    metValue: 10.0,
    category: "Sports",
  },
  {
    name: "Basketball (Game)",
    localized: "Basketbal (zápas)",
    metValue: 8.0,
    category: "Sports",
  },
  {
    name: "Tennis (Singles)",
    localized: "Tenis (dvojhra)",
    metValue: 8.0,
    category: "Sports",
  },
  {
    name: "Hiking (Cross Country)",
    localized: "Turistika",
    metValue: 6.0,
    category: "Recreation",
  },
  {
    name: "Dancing (General)",
    localized: "Tanec",
    metValue: 4.5,
    category: "Recreation",
  },
  {
    name: "Boxing (Punching Bag)",
    localized: "Box (do vreca)",
    metValue: 5.5,
    category: "Sports",
  },
];

const run = async () => {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(ACTIVITY_COLLECTION);

    console.log("Connected successfully.");
    console.log(`Preparing to seed ${activityData.length} activity items...`);

    // Prepare operations for the native driver
    const bulkOps = activityData.map((item) => {
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
              metValue: item.metValue,
              category: item.category,
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
