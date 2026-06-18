import { NextRequest } from "next/server";
import { withAuth } from "../functions";

import { getActivity } from "@/lib/mongo/activity-db";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const activityData = await getActivity();
      return ApiSuccess(activityData, 200);
    } catch (error) {
      logger.error("Database error in GET /api/activity:", error);
      return ApiError("There was an error while sending data to db", 500);
    }
  });
}
