import { NextRequest } from "next/server";
import { checkForSavedFoodMonth } from "@/lib/mongo/food-db";
import { withAuth } from "../functions";
import { auth } from "@/lib/auth";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, authData) => {
    try {
      const dateTo = req.nextUrl.searchParams.get("dateTo");
      const dateFrom = req.nextUrl.searchParams.get("dateFrom");

      const userID = authData.user.id;

      if (!dateFrom) {
        return ApiError("Missing or invalid dateFrom", 400);
      }

      if (!dateTo) {
        return ApiError("Missing or invalid dateTo", 400);
      }

      const food = await checkForSavedFoodMonth(dateFrom, dateTo, userID);
      return ApiSuccess(food);
    } catch (error) {
      logger.error("Error in GET /api/lastMonthFood:", error);
      return ApiError("Error getting saved food from user", 500);
    }
  });
}
