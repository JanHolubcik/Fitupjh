import { NextRequest } from "next/server";

import { FoodType } from "@/types/Types";
import { isValid, parseISO } from "date-fns";
import { withAuth } from "../functions";
import { checkForSavedFood, saveFoodInDay } from "@/lib/mongo/food-db";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

type SaveFoodRequest = {
  date: string;
  savedFood: FoodType;
  userID: string;
};

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
    const { date, savedFood } = (await req.json()) as Omit<SaveFoodRequest, "userID">;
    const userID = authData.user.id;

    if (!date) {
      return ApiError("Missing or invalid date", 400);
    }

    if (
      !savedFood ||
      typeof savedFood !== "object" ||
      !Array.isArray(savedFood.breakfast) ||
      !Array.isArray(savedFood.lunch) ||
      !Array.isArray(savedFood.dinner)
    ) {
      return ApiError("Missing or invalid savedFood", 400);
    }

    try {
      await saveFoodInDay(date, savedFood, userID);
      return ApiSuccess("Successfully saved to db", 201);
    } catch (error) {
      logger.error("Error saving food", error);
      return ApiError("There was an error while sending data to db", 500);
    }
  });
}
