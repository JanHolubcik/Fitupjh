import { NextRequest } from "next/server";
import { checkForSavedWater, saveWaterInDay } from "@/lib/mongo/water-db";
import { isValid, parse } from "date-fns";
import { withAuth } from "../functions";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { SaveWaterSchema } from "@/lib/validationShemas/saveWaterValidationSchema";

export const GET = async (req: NextRequest) => {
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

      const res = await checkForSavedWater(date, userID);

      if (!res || !res.entries) {
        return ApiSuccess([]);
      }

      return ApiSuccess(res.entries);
    } catch (error) {
      logger.error("Error in GET /api/saveWater:", error);
      return ApiError("There was an error while retrieving water logs", 500);
    }
  });
};

export const POST = async (req: NextRequest) => {
  return withAuth(req, async (req, authData) => {
    try {
      const rawData = await req.json();
      const result = SaveWaterSchema.safeParse(rawData);

      if (!result.success) {
        return ApiError(result.error, 400);
      }

      const { date, entries } = result.data;
      const userID = authData.user.id;

      await saveWaterInDay(date, entries, userID);
      return ApiSuccess("Successfully saved to db", 201);
    } catch (error) {
      logger.error("Database save error in POST /api/saveWater:", error);
      return ApiError("There was an error while sending data to db", 500);
    }
  });
};
