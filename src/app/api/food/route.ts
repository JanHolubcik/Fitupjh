import { addNewFood, getFood } from "@/lib/food-db";
import { FoodSchema } from "@/lib/validationShemas/foodValidationSchema";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "../functions";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    const rawData = await req.json();
    const result = FoodSchema.safeParse(rawData);

    if (!result.success) {
      return NextResponse.json({ errors: result.error }, { status: 400 });
    }
    const validatedData = result.data;

    if (validatedData) {
      const res = await addNewFood(validatedData).catch(() => {
        return new NextResponse("There was an error while sending data to db", {
          status: 500,
        });
      });
      return NextResponse.json({ res });
    }

    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  });
}

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const { searchParams } = req.nextUrl;
    const searchTerm = searchParams.get("searchTerm") || "";
    const cookieStore = cookies();
    const language = (await cookieStore).get("i18next")?.value || "en";
    try {
      const foodData = await getFood(searchTerm, language);

      return NextResponse.json(foodData.food, { status: 200 });
    } catch (error) {
      console.error("Database error:", error);
      return new NextResponse("There was an error while sending data to db", {
        status: 500,
      });
    }
  });
}
