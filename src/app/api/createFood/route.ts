import Food from "@/app/food/page";
import { addNewFood } from "@/lib/food-db";
import { FoodSchema } from "@/lib/validationShemas/foodValidationSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
const { searchParams } = new URL(req.url);
  
  const rawData = await req.json();
  const result = FoodSchema.safeParse(rawData);

  if (!FoodSchema.safeParse(rawData).success) {
    return NextResponse.json({ errors: result.error }, { status: 400 });
  }
    const validatedData = result.data;

  if (validatedData){
  const res = await addNewFood(validatedData).catch(
    () => 
      new NextResponse("There was an error while sending data to db",{
        status:500,
      })
  );
    return Response.json({res});
  }
  
}
