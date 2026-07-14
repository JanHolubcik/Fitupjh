import { NextRequest } from "next/server";
import { withAdminAuth } from "../../functions";
import { getFoodsPaginated, addNewFood, updateFood, deleteFood } from "@/lib/mongo/food-db";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { FoodSchema } from "@/lib/validationShemas/foodValidationSchema";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  return withAdminAuth(req, async (innerReq) => {
    try {
      const search = innerReq.nextUrl.searchParams.get("query") || undefined;
      const page = parseInt(innerReq.nextUrl.searchParams.get("page") || "1", 10);
      const limit = parseInt(innerReq.nextUrl.searchParams.get("limit") || "6", 10);

      const result = await getFoodsPaginated(search, page, limit);
      return ApiSuccess(result);
    } catch (error) {
      logger.error("Error fetching food for admin", error);
      return ApiError("Failed to fetch food", 500);
    }
  });
};

export const POST = async (req: NextRequest) => {
  return withAdminAuth(req, async (innerReq) => {
    try {
      const body = await innerReq.json();
      const parsed = FoodSchema.safeParse(body);

      if (!parsed.success) {
        return ApiError(parsed.error, 400);
      }

      const res = await addNewFood(parsed.data);
      if (!res.success) {
        return ApiError(res.error, 400);
      }
      return ApiSuccess(res.data, 201);
    } catch (error) {
      logger.error("Error creating food for admin", error);
      const message = error instanceof Error ? error.message : "Failed to create food";
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
        return ApiError("Food ID is required", 400);
      }

      const parsed = FoodSchema.safeParse(data);
      if (!parsed.success) {
        return ApiError(parsed.error, 400);
      }

      try {
        const success = await updateFood(id, parsed.data);
        if (success) {
          return ApiSuccess({ success: true }, 200);
        }
        return ApiError("No changes made or food not found", 400);
      } catch (dbError) {
        if (dbError instanceof Error && dbError.message === "name_conflict") {
          return ApiError("name_conflict", 409);
        }
        throw dbError;
      }
    } catch (error) {
      logger.error("Error updating food for admin", error);
      const message = error instanceof Error ? error.message : "Failed to update food";
      return ApiError(message, 500);
    }
  });
};

export const DELETE = async (req: NextRequest) => {
  return withAdminAuth(req, async (innerReq) => {
    try {
      const id = innerReq.nextUrl.searchParams.get("id");
      if (!id) {
        return ApiError("Food ID is required", 400);
      }

      const success = await deleteFood(id);
      if (success) {
        return ApiSuccess({ success: true }, 200);
      }
      return ApiError("Food not found", 404);
    } catch (error) {
      logger.error("Error deleting food for admin", error);
      const message = error instanceof Error ? error.message : "Failed to delete food";
      return ApiError(message, 500);
    }
  });
};
