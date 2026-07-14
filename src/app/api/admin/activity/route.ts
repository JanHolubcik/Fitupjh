import { NextRequest } from "next/server";
import { withAdminAuth } from "../../functions";
import { getActivitiesPaginated, addNewActivity, updateActivity, deleteActivity } from "@/lib/mongo/activity-db";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { ActivityCatalogSchema } from "@/lib/validationShemas/saveActivityValidationSchema";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  return withAdminAuth(req, async (innerReq) => {
    try {
      const search = innerReq.nextUrl.searchParams.get("query") || undefined;
      const page = parseInt(innerReq.nextUrl.searchParams.get("page") || "1", 10);
      const limit = parseInt(innerReq.nextUrl.searchParams.get("limit") || "6", 10);

      const result = await getActivitiesPaginated(search, page, limit);
      return ApiSuccess(result);
    } catch (error) {
      logger.error("Error fetching activities for admin", error);
      return ApiError("Failed to fetch activities", 500);
    }
  });
};

export const POST = async (req: NextRequest) => {
  return withAdminAuth(req, async (innerReq) => {
    try {
      const body = await innerReq.json();
      const parsed = ActivityCatalogSchema.safeParse(body);

      if (!parsed.success) {
        return ApiError(parsed.error, 400);
      }

      const res = await addNewActivity(parsed.data);
      if (!res.success) {
        return ApiError(res.error, 400);
      }
      return ApiSuccess(res.data, 201);
    } catch (error) {
      logger.error("Error creating activity for admin", error);
      const message = error instanceof Error ? error.message : "Failed to create activity";
      return ApiError(message, 500);
    }
  });
};

export const PATCH = async (req: NextRequest) => {
  return withAdminAuth(req, async (innerReq) => {
    try {
      const body = await innerReq.json();
      const { id, ...data } = body;

      if (!id) {
        return ApiError("Activity ID is required", 400);
      }

      const parsed = ActivityCatalogSchema.safeParse(data);
      if (!parsed.success) {
        return ApiError(parsed.error, 400);
      }

      try {
        const success = await updateActivity(id, parsed.data);
        if (success) {
          return ApiSuccess({ success: true }, 200);
        }
        return ApiError("No changes made or activity not found", 400);
      } catch (dbError) {
        if (dbError instanceof Error && dbError.message === "name_conflict") {
          return ApiError("name_conflict", 409);
        }
        throw dbError;
      }
    } catch (error) {
      logger.error("Error updating activity for admin", error);
      const message = error instanceof Error ? error.message : "Failed to update activity";
      return ApiError(message, 500);
    }
  });
};

export const DELETE = async (req: NextRequest) => {
  return withAdminAuth(req, async (innerReq) => {
    try {
      const id = innerReq.nextUrl.searchParams.get("id");
      if (!id) {
        return ApiError("Activity ID is required", 400);
      }

      const success = await deleteActivity(id);
      if (success) {
        return ApiSuccess({ success: true }, 200);
      }
      return ApiError("Activity not found", 404);
    } catch (error) {
      logger.error("Error deleting activity for admin", error);
      const message = error instanceof Error ? error.message : "Failed to delete activity";
      return ApiError(message, 500);
    }
  });
};
