import { NextRequest } from "next/server";
import { withAdminAuth } from "../../functions";
import { getUsers, updateUserByAdmin, deleteUserByAdmin } from "@/lib/mongo/admin-db";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { adminUpdateUserSchema } from "@/lib/validationShemas/userValidationSchema";
import { logger } from "@/lib/logger";

export const GET = async (req: NextRequest) => {
  return withAdminAuth(req, async (innerReq) => {
    try {
      const search = innerReq.nextUrl.searchParams.get("query") || undefined;
      const roleFilter = innerReq.nextUrl.searchParams.get("role") || undefined;
      const page = parseInt(innerReq.nextUrl.searchParams.get("page") || "1", 10);
      const limit = parseInt(innerReq.nextUrl.searchParams.get("limit") || "6", 10);

      const result = await getUsers(search, roleFilter, page, limit);
      return ApiSuccess(result);
    } catch (error) {
      logger.error("Error fetching users for admin", error);
      return ApiError("Failed to fetch users", 500);
    }
  });
};

export const PATCH = async (req: NextRequest) => {
  return withAdminAuth(req, async (innerReq) => {
    try {
      const body = await innerReq.json();
      const parsed = adminUpdateUserSchema.safeParse(body);

      if (!parsed.success) {
        return ApiError(parsed.error, 400);
      }

      const { userId, name, email, role } = parsed.data;

      try {
        const success = await updateUserByAdmin(userId, { name, email, role });
        if (success) {
          return ApiSuccess({ success: true }, 200);
        }
        return ApiError("No changes made or user not found", 400);
      } catch (dbError) {
        if (dbError instanceof Error && dbError.message === "email_conflict") {
          return ApiError("email_conflict", 409);
        }
        throw dbError;
      }
    } catch (error) {
      logger.error("Error updating user for admin", error);
      const message = error instanceof Error ? error.message : "Failed to update user";
      return ApiError(message, 500);
    }
  });
};

export const DELETE = async (req: NextRequest) => {
  return withAdminAuth(req, async (innerReq) => {
    try {
      const userId = innerReq.nextUrl.searchParams.get("userId");
      if (!userId) {
        return ApiError("User ID is required", 400);
      }

      const success = await deleteUserByAdmin(userId);
      if (success) {
        return ApiSuccess({ success: true }, 200);
      }
      return ApiError("User not found", 404);
    } catch (error) {
      logger.error("Error deleting user for admin", error);
      const message = error instanceof Error ? error.message : "Failed to delete user";
      return ApiError(message, 500);
    }
  });
};
