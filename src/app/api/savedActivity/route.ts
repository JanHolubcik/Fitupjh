import { NextRequest } from "next/server";

import {
  checkForSavedActivities,
  saveActivitiesInDay,
} from "@/lib/mongo/activity-db";
import { isValid, parse } from "date-fns";
import { withAuth } from "../functions";
import { LoggedActivityType } from "@/features/DashboardSlice/DashboardSlice";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

type SaveActivityRequest = {
  date: string; // "yyyy-MM-dd"
  activities: LoggedActivityType[];
  userID: string;
};

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const date = req.nextUrl.searchParams.get("date");
      const userID = req.nextUrl.searchParams.get("user_id");

      if (!date) {
        return ApiError("Missing or invalid date", 400);
      }

      const parsedDate = parse(date, "yyyy-MM-dd", new Date());
      if (!isValid(parsedDate)) {
        return ApiError("Invalid date format", 400);
      }

      if (!userID || typeof userID !== "string") {
        return ApiError("Missing or invalid userID", 400);
      }

      const res = await checkForSavedActivities(date, userID);

      if (!res || !res.activities) {
        return ApiSuccess([]);
      }

      return ApiSuccess(res.activities);
    } catch (error) {
      logger.error("Error in GET /api/savedActivity:", error);
      return ApiError("There was an error while retrieving activities", 500);
    }
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const { date, activities, userID } =
        (await req.json()) as SaveActivityRequest;

      if (!date) {
        return ApiError("Missing or invalid date", 400);
      }

      if (!activities || !Array.isArray(activities)) {
        return ApiError("Missing or invalid activities array", 400);
      }

      if (!userID || typeof userID !== "string") {
        return ApiError("Missing or invalid userID", 400);
      }

      const parsedDate = parse(date, "yyyy-MM-dd", new Date());
      if (!isValid(parsedDate)) {
        return ApiError("Invalid date format", 400);
      }

      await saveActivitiesInDay(date, activities, userID);
      return ApiSuccess("Successfully saved to db", 201);
    } catch (error) {
      logger.error("Database save error in POST /api/savedActivity:", error);
      return ApiError("There was an error while sending data to db", 500);
    }
  });
}
