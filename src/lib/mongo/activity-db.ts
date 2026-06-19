import mongoose from "mongoose";
import connectDB from "./connect-db";
import { Activity } from "./models/Activity";
import { SavedActivity } from "./models/SavedActivity";
import { LoggedActivityType } from "@/features/DashboardSlice/DashboardSlice";
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

