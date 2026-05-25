import { addNewFood } from "@/lib/food-db";
import { FoodSchema } from "@/lib/validationShemas/foodValidationSchema";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "../functions";

export async function POST(req: NextRequest) {
  return withAuth(req, async (req) => {
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
