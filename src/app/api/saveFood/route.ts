import { NextRequest } from "next/server";

import { isValid, parseISO } from "date-fns";
import { withAuth } from "../functions";
import { checkForSavedFood, saveFoodInDay } from "@/lib/mongo/food-db";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { SaveFoodSchema } from "@/lib/validationShemas/saveFoodValidationSchema";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, authData) => {
    const date = req.nextUrl.searchParams.get("date");
    const userID = authData.user.id;

    if (!date) {
      return ApiError("Missing or invalid date", 400);
    }

    const parsed = parseISO(date);
    if (!isValid(parsed)) {
      return ApiError("Invalid date format", 400);
    }

    const isoDate = parsed.toISOString();

    try {
      const food = await checkForSavedFood(isoDate, userID).then((res) => {
        if (!res.savedFood) {
          return {
            breakfast: [],
            lunch: [],
            dinner: [],
          };
        }
        return res.savedFood;
      });

      return ApiSuccess(food);
    } catch (error) {
      logger.error("Error checking for saved food", error);
      return ApiError("Internal server error", 500);
    }
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, authData) => {
    try {
      const rawData = await req.json();
      const result = SaveFoodSchema.safeParse(rawData);

      if (!result.success) {
        return ApiError(result.error, 400);
      }

      const { date, savedFood } = result.data;
      const userID = authData.user.id;

      await saveFoodInDay(date, savedFood, userID);
      return ApiSuccess("Successfully saved to db", 201);
    } catch (error) {
      logger.error("Error saving food", error);
      return ApiError("There was an error while sending data to db", 500);
    }
  });
}
