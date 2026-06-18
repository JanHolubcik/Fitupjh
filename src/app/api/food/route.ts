import { addNewFood, getFood } from "@/lib/mongo/food-db";
import { FoodSchema } from "@/lib/validationShemas/foodValidationSchema";
import { NextRequest } from "next/server";
import { withAuth } from "../functions";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    const rawData = await req.json();
    const result = FoodSchema.safeParse(rawData);

    if (!result.success) {
      return ApiError(result.error, 400);
    }
    const validatedData = result.data;

    if (validatedData) {
      try {
        const res = await addNewFood(validatedData);
        return ApiSuccess({ res });
      } catch (error) {
        logger.error("Failed to add new food", error);
        return ApiError("There was an error while sending data to db", 500);
      }
    }

    return ApiError("Invalid data", 400);
  });
}

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const { searchParams } = req.nextUrl;
    const searchTerm = searchParams.get("searchTerm") || "";
    const language = searchParams.get("currentLocale") || "en";

    try {
      const foodData = await getFood(searchTerm, language);
      return ApiSuccess(foodData.food, 200);
    } catch (error) {
      logger.error("Database error in GET /api/food", error);
      return ApiError("There was an error while sending data to db", 500);
    }
  });
}
