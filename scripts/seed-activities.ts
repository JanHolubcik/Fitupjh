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
    icon: "FaWalking",
  },
  {
    name: "Running (Moderate)",
    localized: "Beh (stredné tempo)",
    metValue: 9.8,
    category: "Cardio",
    icon: "FaRunning",
  },
  {
    name: "Cycling (Moderate)",
    localized: "Bicyklovanie (stredné)",
    metValue: 7.5,
    category: "Cardio",
    icon: "FaBicycle",
  },
  {
    name: "Swimming (Freestyle)",
    localized: "Plávanie (kraul)",
    metValue: 5.8,
    category: "Cardio",
    icon: "FaSwimmer",
  },
  {
    name: "Jump Rope",
    localized: "Skákanie cez švihadlo",
    metValue: 10.0,
    category: "Cardio",
    icon: "FaHeartbeat", // Universal fallback for intense cardio
  },
  {
    name: "Rowing Machine",
    localized: "Veslovací trenažér",
    metValue: 6.0,
    category: "Cardio",
    icon: "FaWater",
  },

  // --- STRENGTH & FLEXIBILITY ---
  {
    name: "Weightlifting (General)",
    localized: "Posilňovanie (bežné)",
    metValue: 3.5,
    category: "Strength",
    icon: "FaDumbbell",
  },
  {
    name: "Weightlifting (Vigorous)",
    localized: "Posilňovanie (intenzívne)",
    metValue: 6.0,
    category: "Strength",
    icon: "FaDumbbell",
  },
  {
    name: "Bodyweight Exercises",
    localized: "Cvičenie s vlastnou váhou",
    metValue: 4.3,
    category: "Strength",
    icon: "FaChild",
  },
  {
    name: "Yoga",
    localized: "Joga",
    metValue: 2.5,
    category: "Flexibility",
    icon: "FaSpa",
  },
  {
    name: "Pilates",
    localized: "Pilates",
    metValue: 3.0,
    category: "Flexibility",
    icon: "FaYinYang",
  },
  {
    name: "Stretching",
    localized: "Strečing",
    metValue: 2.3,
    category: "Flexibility",
    icon: "FaChild",
  },

  // --- SPORTS & RECREATION ---
  {
    name: "Soccer (Competitive)",
    localized: "Futbal (zápas)",
    metValue: 10.0,
    category: "Sports",
    icon: "FaFutbol",
  },
  {
    name: "Basketball (Game)",
    localized: "Basketbal (zápas)",
    metValue: 8.0,
    category: "Sports",
    icon: "FaBasketballBall",
  },
  {
    name: "Tennis (Singles)",
    localized: "Tenis (dvojhra)",
    metValue: 8.0,
    category: "Sports",
    icon: "FaTableTennis",
  },
  {
    name: "Hiking (Cross Country)",
    localized: "Turistika",
    metValue: 6.0,
    category: "Recreation",
    icon: "FaMountain",
  },
  {
    name: "Dancing (General)",
    localized: "Tanec",
    metValue: 4.5,
    category: "Recreation",
    icon: "FaMusic",
  },
  {
    name: "Boxing (Punching Bag)",
    localized: "Box (do vreca)",
    metValue: 5.5,
    category: "Sports",
    icon: "FaFistRaised",
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

    const bulkOps = activityData.map((item) => {
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
              icon: item.icon, // <--- Add the icon string to the DB
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
