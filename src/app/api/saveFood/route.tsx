import { getSavedFood } from "@/lib/YourIntake/search-db";
import { NextRequest, NextResponse } from "next/server";
import { saveFoodInDay } from "@/lib/food-db";

interface GetSavedFood {
  date: string;
  user_id: string;
}
// Rest api
export async function GET(req: NextRequest) {
  // Get data from your database

  const date = req.nextUrl.searchParams.get("date");
  const user_id = req.nextUrl.searchParams.get("user_id");

  if (date && user_id) {
    const food = await getSavedFood(date, user_id)
      .then((res) => {
        if (!res.savedFood) {
          return {
            breakfast: [],
            lunch: [],
            dinner: [],
          };
        }
        return res.savedFood;
      })
      .catch((err) => {
        console.log(err);
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
  const { date, savedFood, userID } = await req.json();
  const res = await saveFoodInDay(date, savedFood, userID).catch(
    () =>
      new NextResponse("There was an error while sending data to db", {
        status: 500,
      })
  );
  return Response.json({ res });
}
