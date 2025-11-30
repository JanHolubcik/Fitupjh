import { getSavedFood } from "@/lib/YourIntake/search-db";
import { NextRequest, NextResponse } from "next/server";
import { checkForSavedFoodMonth, saveFoodInDay } from "@/lib/food-db";
import { foodType } from "@/types/Types";
import { addDays, isValid, parseISO, subDays } from "date-fns";

type SaveFoodRequest = {
  date: string;
  savedFood: foodType; // or your specific type
  userID: string;
};

export async function GET(req: NextRequest) {
  const dateTo = req.nextUrl.searchParams.get("dateTo");
  const dateFrom = req.nextUrl.searchParams.get("dateFrom");
  const userID = req.nextUrl.searchParams.get("user_id");

  if (!userID || typeof userID !== "string") {
    return new Response("Missing or invalid userID", { status: 400 });
  }

  if (!dateTo) {
    return new Response("Missing or invalid dateTo", { status: 400 });
  }

  const dTo = parseISO(dateTo);
  if (!isValid(dTo)) {
    return new Response("Invalid dateFrom format", { status: 400 });
  }

  let dFrom: Date;

  if (!dateFrom) {
    dFrom = subDays(dTo, 30);
  } else {
    dFrom = parseISO(dateTo);

    if (!isValid(dTo)) {
      return new Response("Invalid dateTo format", { status: 400 });
    }
  }
  const dateFromISO = dFrom.toISOString();
  if (dateTo && userID && dateFromISO) {
    const food = await checkForSavedFoodMonth(dateFromISO, dateTo, userID);

    return NextResponse.json(food);
  } else {
    return new NextResponse("Error getting saved food from user", {
      status: 500,
    });
  }
}
