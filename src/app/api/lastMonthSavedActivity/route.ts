import { NextRequest } from "next/server";
import { isValid, parseISO } from "date-fns";
import { withAuth } from "../functions";
import { auth } from "@/lib/auth";
import { checkForSavedActivitiesMonth } from "@/lib/mongo/activity-db";
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

      const dFrom = parseISO(dateFrom);
      if (!isValid(dFrom)) {
        return ApiError("Invalid dateFrom format", 400);
      }

      const dTo = parseISO(dateTo);
      if (!isValid(dTo)) {
        return ApiError("Invalid dateTo format", 400);
      }

      const activities = await checkForSavedActivitiesMonth(dateFrom, dateTo, userID);
      return ApiSuccess(activities);
    } catch (error) {
      logger.error("Error in GET /api/lastMonthSavedActivity:", error);
      return ApiError("Error getting saved activities from user", 500);
    }
  });
}
