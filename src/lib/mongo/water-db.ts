import mongoose from "mongoose";
import connectDB from "./connect-db";
import { SavedWater } from "./models/SavedWater";
import { WaterEntryType } from "@/types/Types";
import { addDays, format, parse } from "date-fns";

export const checkForSavedWater = async (date: string, user_id: string) => {
  await connectDB();

  const existingRecord = await SavedWater.findOne({
    day: date,
    user_id: new mongoose.Types.ObjectId(user_id),
  }).lean();

  return existingRecord && existingRecord.entries
    ? { entries: existingRecord.entries as WaterEntryType[] }
    : { entries: [] };
};

export const saveWaterInDay = async (
  date: string,
  entries: WaterEntryType[],
  user_id: mongoose.Types.ObjectId | string,
) => {
  await connectDB();

  const existingRecord = await SavedWater.findOneAndUpdate(
    {
      day: date,
      user_id: new mongoose.Types.ObjectId(user_id),
    },
    {
      $set: {
        entries: entries,
      },
      $setOnInsert: {
        day: date,
        user_id: new mongoose.Types.ObjectId(user_id),
      },
    },
    { upsert: true, new: true },
  );

  return existingRecord;
};

export const checkForSavedWaterMonth = async (
  dateFrom: string,
  dateTo: string,
  user_id: string,
): Promise<Record<string, WaterEntryType[]>> => {
  await connectDB();

  const existingRecords = await SavedWater.find({
    user_id: new mongoose.Types.ObjectId(user_id),
    day: { $gte: dateFrom, $lte: dateTo },
  }).lean();

  const recordMap = new Map<string, WaterEntryType[]>();
  existingRecords.forEach((record) => {
    const rawEntries = record.entries as WaterEntryType[] | undefined;
    recordMap.set(record.day.toString(), rawEntries || []);
  });

  const waterMonth: Record<string, WaterEntryType[]> = {};

  let currentParsedDate = parse(dateFrom, "yyyy-MM-dd", new Date());
  const endParsedDate = parse(dateTo, "yyyy-MM-dd", new Date());

  while (currentParsedDate <= endParsedDate) {
    const dateStr = format(currentParsedDate, "yyyy-MM-dd");

    if (recordMap.has(dateStr)) {
      waterMonth[dateStr] = recordMap.get(dateStr)!;
    } else {
      waterMonth[dateStr] = [];
    }

    currentParsedDate = addDays(currentParsedDate, 1);
  }

  return waterMonth;
};
