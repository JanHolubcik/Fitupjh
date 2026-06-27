import { addNewFood, getFoodByBarcode } from "@/lib/mongo/food-db";

import { NextRequest } from "next/server";
import { withAuth } from "../functions";
import { ApiSuccess, ApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    const QRCode = req.nextUrl.searchParams.get("QRCode");

    if (!QRCode) {
      return ApiError("Missing or invalid QRCode", 400);
    }

    // Validate barcode format (8-14 digits) to prevent SSRF / path traversal
    if (!/^\d{8,14}$/.test(QRCode)) {
      return ApiError("Invalid barcode format", 400);
    }
    try {
      const localFood = await getFoodByBarcode(QRCode);

      if (localFood) {
        return ApiSuccess(localFood);
      }

      logger.info(`Barcode ${QRCode} not found in local database. Fetching from Open Food Facts API...`);

      const apiResponse = await fetch(
        `https://world.openfoodfacts.org/api/v3/product/${QRCode}`,
        {
          headers: {
            "User-Agent": "MyCalorieTrackerApp/1.0 (contact@yourdomain.com)",
          },
        },
      );

      if (!apiResponse.ok) {
        if (apiResponse.status === 404) {
          return ApiSuccess({ notFound: true, barcode: QRCode }, 200);
        }
        return ApiError("External product lookup registry down", 502);
      }

      const apiData = await apiResponse.json();

      if (!apiData.product || apiData.status === 0) {
        return ApiError("Product not found locally or globally", 404);
      }

      const targetProduct = apiData.product;
      const nutriments = targetProduct.nutriments || {};

      const rawCalories =
        nutriments["energy-kcal_100g"] ||
        (nutriments["energy_100g"]
          ? Math.round(nutriments["energy_100g"] * 0.2390057)
          : 0);

      const newlyMappedFood = {
        name:
          targetProduct.product_name + " " + targetProduct.brands ||
          `Unknown Product (${QRCode})`,
        calories_per_100g: Number(rawCalories) || 0,
        fat: Number(nutriments.fat_100g) || 0,
        protein: Number(nutriments.proteins_100g) || 0,
        sugar: Number(nutriments.sugars_100g) || 0,
        carbohydrates: Number(nutriments.carbohydrates_100g) || 0,
        fiber: Number(nutriments.fiber_100g) || 0,
        salt: Number(nutriments.salt_100g) || 0,
        QRcode: QRCode,
        imgUrl: targetProduct.image_url || "",
        ProductWeight: parseInt(targetProduct.quantity) || undefined,
      };

      try {
        await addNewFood(newlyMappedFood);
      } catch (error) {
        logger.error("Failed to add new food from scanner", error);
        return ApiError("There was an error while sending data to db", 500);
      }

      return ApiSuccess({
        ...newlyMappedFood,
      });
    } catch (error) {
      logger.error("Critical Internal Server Error in POST /api/foodScan:", error);
      return ApiError(
        error instanceof Error
          ? error.message
          : "Database connection lost or internal crash.",
        500,
      );
    }
  });
}
