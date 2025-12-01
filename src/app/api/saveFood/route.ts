import { getSavedFood } from "@/lib/YourIntake/search-db";
import { NextRequest, NextResponse } from "next/server";
import { saveFoodInDay } from "@/lib/food-db";
import { foodType } from "@/types/Types";
import { isValid, parseISO } from "date-fns";

type SaveFoodRequest = {
  date: string;
  savedFood: foodType; // or your specific type
  userID: string;
};

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const userID = req.nextUrl.searchParams.get("user_id");

  if (!date) {
    return new Response("Missing or invalid date", { status: 400 });
  }

  const parsed = parseISO(date);
  if (!isValid(parsed)) {
    return new Response("Invalid date format", { status: 400 });
  }

  if (!userID || typeof userID !== "string") {
    return new Response("Missing or invalid userID", { status: 400 });
  }
  const isoDate = parsed.toISOString();

  const food = await getSavedFood(isoDate, userID).then((res) => {
    if (!res.savedFood) {
      return {
        breakfast: [],
        lunch: [],
        dinner: [],
      };
    }
    return res.savedFood;
  });

  return NextResponse.json(food);
}

export async function POST(req: Request) {
  const { date, savedFood, userID } = (await req.json()) as SaveFoodRequest;

  if (!date) {
    return new Response("Missing or invalid date", { status: 400 });
  }

  if (
    !savedFood ||
    typeof savedFood !== "object" ||
    !Array.isArray(savedFood.breakfast) ||
    !Array.isArray(savedFood.lunch) ||
    !Array.isArray(savedFood.dinner)
  ) {
    return new Response("Missing or invalid savedFood", { status: 400 });
  }

  if (!userID || typeof userID !== "string") {
    return new Response("Missing or invalid userID", { status: 400 });
  }

  const parsed = parseISO(date);
  if (!isValid(parsed)) {
    return new Response("Invalid date format", { status: 400 });
  }
  const isoDate = parsed.toISOString();
  const res = await saveFoodInDay(isoDate, savedFood, userID).catch(
    () =>
      new NextResponse("There was an error while sending data to db", {
        status: 500,
      })
  );
  return Response.json({ res });
}
