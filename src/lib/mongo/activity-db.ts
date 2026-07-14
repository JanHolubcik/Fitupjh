import mongoose from "mongoose";
import connectDB from "./connect-db";
import { Activity } from "./models/Activity";
import { SavedActivity } from "./models/SavedActivity";
import { LoggedActivityType } from "@/types/Types";
import { addDays, format, parse } from "date-fns";

/**
 *
 * @returns All activities.
 */
export async function getActivity() {
  await connectDB();

  const activity = await Activity.find({}).lean().exec();

  return activity;
}

export async function checkForSavedActivities(date: string, user_id: string) {
  await connectDB();

  const existingRecord = await SavedActivity.findOne({
    day: date,
    user_id: new mongoose.Types.ObjectId(user_id),
  });

  // Matches the check in your GET route: if (!res || !res.activities)
  return existingRecord ? { activities: existingRecord.activities } : {};
}

/**
 * Saving activities after user adds them.
 * @param date - The date string ("yyyy-MM-dd")
 * @param activities - Array of activities to save
 * @param _id - User ID
 * @returns The updated record or Error.
 */
export async function saveActivitiesInDay(
  date: string,
  activities: LoggedActivityType[],
  _id: mongoose.Types.ObjectId | string,
) {
  await connectDB();

  // findOneAndUpdate with upsert handles both creating new records and updating existing ones
  const existingRecord = await SavedActivity.findOneAndUpdate(
    {
      day: date,
      user_id: new mongoose.Types.ObjectId(_id),
    },
    {
      $set: {
        activities: activities,
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

export async function checkForSavedActivitiesMonth(
  dateFrom: string, // e.g., "2023-10-01"
  dateTo: string, // e.g., "2023-10-31"
  user_id: string,
) {
  await connectDB();

  const existingRecords = await SavedActivity.find({
    user_id: new mongoose.Types.ObjectId(user_id),
    day: { $gte: dateFrom, $lte: dateTo },
  }).lean();

  const recordMap = new Map<string, (typeof existingRecords)[number]>();
  existingRecords.forEach((record) => {
    recordMap.set(record.day, record);
  });

  const activityMonth: Record<string, LoggedActivityType[]> = {};

  let currentParsedDate = parse(dateFrom, "yyyy-MM-dd", new Date());
  const endParsedDate = parse(dateTo, "yyyy-MM-dd", new Date());

  while (currentParsedDate <= endParsedDate) {
    const dateStr = format(currentParsedDate, "yyyy-MM-dd");

    if (recordMap.has(dateStr)) {
      const rawActivities = recordMap.get(dateStr)!.activities;

      activityMonth[dateStr] = (rawActivities as unknown[]).map((act) => {
        const rawAct = act as {
          _id?: mongoose.Types.ObjectId | string;
          activity?: mongoose.Types.ObjectId | string;
          durationMinutes: number;
          caloriesBurned: number;
        };
        return {
          ...rawAct,
          id: rawAct._id?.toString() || "",
          activity: rawAct.activity?.toString() || "",
          durationMinutes: rawAct.durationMinutes,
          caloriesBurned: rawAct.caloriesBurned,
        };
      });
    } else {
      activityMonth[dateStr] = [];
    }

    currentParsedDate = addDays(currentParsedDate, 1);
  }

  return activityMonth;
}

export async function addNewActivity(data: {
  name: string;
  metValue: number;
  category?: string;
  icon?: string;
}) {
  await connectDB();

  const escapedName = data.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const existingRecord = await Activity.findOne({
    name: { $regex: new RegExp(`^${escapedName}$`, "i") },
  });

  if (existingRecord) {
    return { success: false, error: "This activity already exists." };
  }

  const insertedNew = await Activity.create({
    name: data.name,
    metValue: data.metValue,
    category: data.category || "General",
    icon: data.icon,
  });

  return {
    success: true,
    data: JSON.parse(JSON.stringify(insertedNew)),
  };
}

export async function getActivitiesPaginated(
  search?: string,
  page: number = 1,
  limit: number = 6
): Promise<{ activities: any[]; total: number }> {
  await connectDB();

  const query: Record<string, any> = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const total = await Activity.countDocuments(query);
  const skip = (page - 1) * limit;

  const activities = await Activity.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();

  return {
    activities: JSON.parse(JSON.stringify(activities)),
    total,
  };
}

export async function updateActivity(
  activityId: string,
  data: { name: string; metValue: number; category?: string; icon?: string }
): Promise<boolean> {
  await connectDB();

  if (data.name) {
    const escapedName = data.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const existing = await Activity.findOne({
      name: { $regex: new RegExp(`^${escapedName}$`, "i") },
      _id: { $ne: new mongoose.Types.ObjectId(activityId) },
    }).lean();
    if (existing) {
      throw new Error("name_conflict");
    }
  }

  const result = await Activity.updateOne(
    { _id: new mongoose.Types.ObjectId(activityId) },
    { $set: data }
  );

  return result.modifiedCount > 0 || result.matchedCount > 0;
}

export async function deleteActivity(activityId: string): Promise<boolean> {
  await connectDB();

  const result = await Activity.deleteOne({
    _id: new mongoose.Types.ObjectId(activityId),
  });

  return result.deletedCount > 0;
}

