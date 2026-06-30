import { NextRequest } from "next/server";

import {
  checkForSavedActivities,
  saveActivitiesInDay,
} from "@/lib/mongo/activity-db";
import { isValid, parse } from "date-fns";
import { withAuth } from "../functions";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { SaveActivitySchema } from "@/lib/validationShemas/saveActivityValidationSchema";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, authData) => {
    try {
      const date = req.nextUrl.searchParams.get("date");
      const userID = authData.user.id;

      if (!date) {
        return ApiError("Missing or invalid date", 400);
      }

      const parsedDate = parse(date, "yyyy-MM-dd", new Date());
      if (!isValid(parsedDate)) {
        return ApiError("Invalid date format", 400);
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
  return withAuth(req, async (req, authData) => {
    try {
      const rawData = await req.json();
      const result = SaveActivitySchema.safeParse(rawData);

      if (!result.success) {
        return ApiError(result.error, 400);
      }

      const { date, activities } = result.data;
      const userID = authData.user.id;

      await saveActivitiesInDay(date, activities, userID);
      return ApiSuccess("Successfully saved to db", 201);
    } catch (error) {
      logger.error("Database save error in POST /api/savedActivity:", error);
      return ApiError("There was an error while sending data to db", 500);
    }
  });
}
