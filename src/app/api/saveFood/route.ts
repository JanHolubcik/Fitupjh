import { getSavedFood } from "@/lib/YourIntake/search-db";
import { NextRequest, NextResponse } from "next/server";
import { saveFoodInDay } from "@/lib/food-db";
import { foodType } from "@/types/foodTypes";

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

  if (!userID || typeof userID !== "string") {
    return new Response("Missing or invalid userID", { status: 400 });
  }

  if (date && userID) {
    const food = await getSavedFood(date, userID).then((res) => {
      if (!res.savedFood) {
        return {
          breakfast: [],
          lunch: [],
          dinner: [],
        };
      }
      return res.savedFood;
    });

    food?.breakfast;
    return NextResponse.json(food);
  } else {
    return new NextResponse("Error getting saved food from user", {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  const { date, savedFood, userID } = (await req.json()) as SaveFoodRequest;

  if (!date) {
    return new Response("Missing or invalid date", { status: 400 });
  }

  if (!savedFood || !Array.isArray(savedFood)) {
    return new Response("Missing or invalid savedFood", { status: 400 });
  }

  if (!userID || typeof userID !== "string") {
    return new Response("Missing or invalid userID", { status: 400 });
  }

  const res = await saveFoodInDay(date, savedFood, userID).catch(
    () =>
      new NextResponse("There was an error while sending data to db", {
        status: 500,
      })
  );
  return Response.json({ res });
}
