import { addNewFood, getFoodByQR } from "@/lib/food-db";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const QRCode = req.nextUrl.searchParams.get("QRCode");

  if (!QRCode) {
    return new Response("Missing or invalid QRCode", { status: 400 });
  }
  try {
    const localFood = await getFoodByQR(QRCode);

    if (localFood.error !== "Food not found") {
      return NextResponse.json(localFood);
    }

    console.log(
      `Barcode ${QRCode} not found in local database. Fetching from Open Food Facts API...`,
    );

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
        return NextResponse.json(
          { notFound: true, barcode: QRCode },
          { status: 200 },
        );
      }
      return NextResponse.json(
        { error: "External product lookup registry down" },
        { status: 502 },
      );
    }

    const apiData = await apiResponse.json();

    if (!apiData.product || apiData.status === 0) {
      return NextResponse.json(
        { error: "Product not found locally or globally" },
        { status: 404 },
      );
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

    await addNewFood(newlyMappedFood).catch(() => {
      return new NextResponse("There was an error while sending data to db", {
        status: 500,
      });
    });

    return NextResponse.json({
      ...newlyMappedFood,
    });
  } catch (error) {
    console.error("Critical Internal Server Error in GET Route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Database connection lost or internal crash.",
      },
      { status: 500 },
    );
  }
}
