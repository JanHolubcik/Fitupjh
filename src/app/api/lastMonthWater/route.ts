import { NextRequest } from "next/server";
import { isValid, parseISO } from "date-fns";
import { withAuth } from "../functions";
import { checkForSavedWaterMonth } from "@/lib/mongo/water-db";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export const GET = async (req: NextRequest) => {
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

      const dFrom = parseISO(dateFrom);
      if (!isValid(dFrom)) {
        return ApiError("Invalid dateFrom format", 400);
      }

      const dTo = parseISO(dateTo);
      if (!isValid(dTo)) {
        return ApiError("Invalid dateTo format", 400);
      }

      const water = await checkForSavedWaterMonth(dateFrom, dateTo, userID);
      return ApiSuccess(water);
    } catch (error) {
      logger.error("Error in GET /api/lastMonthWater:", error);
      return ApiError("Error getting saved water from user", 500);
    }
  });
};
