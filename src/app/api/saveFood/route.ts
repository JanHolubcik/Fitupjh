import { NextRequest, NextResponse } from "next/server";
import { checkForSavedFood, saveFoodInDay } from "@/lib/food-db";
import { FoodType } from "@/types/Types";
import { isValid, parse, parseISO } from "date-fns";
import { withAuth } from "../functions";

type SaveFoodRequest = {
  date: string;
  savedFood: FoodType;
  userID: string;
};

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const date = req.nextUrl.searchParams.get("date");
    const userID = req.nextUrl.searchParams.get("user_id");

    if (!date) {
      return new NextResponse("Missing or invalid date", { status: 400 });
    }

    const parsed = parseISO(date);
    if (!isValid(parsed)) {
      return new NextResponse("Invalid date format", { status: 400 });
    }

    if (!userID || typeof userID !== "string") {
      return new NextResponse("Missing or invalid userID", { status: 400 });
    }
    const isoDate = parsed.toISOString();

    const food = await checkForSavedFood(isoDate, userID).then((res) => {
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
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    const { date, savedFood, userID } = (await req.json()) as SaveFoodRequest;

    if (!date) {
      return new NextResponse("Missing or invalid date", { status: 400 });
    }

    if (
      !savedFood ||
      typeof savedFood !== "object" ||
      !Array.isArray(savedFood.breakfast) ||
      !Array.isArray(savedFood.lunch) ||
      !Array.isArray(savedFood.dinner)
    ) {
      return new NextResponse("Missing or invalid savedFood", { status: 400 });
    }

    if (!userID || typeof userID !== "string") {
      return new NextResponse("Missing or invalid userID", { status: 400 });
    }
    //before there was a problem with converting to ISO date, the converting was 2 hours from
    //current date
    const parsedDate = parse(date, "yyyy-MM-dd", new Date());
    const utcDate = new Date(
      Date.UTC(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
        0,
        0,
        0,
      ),
    );

    const parsed = parseISO(date);
    if (!isValid(parsed)) {
      return new NextResponse("Invalid date format", { status: 400 });
    }
    const isoDate = utcDate.toISOString();
    const formattedDate = isoDate.replace("Z", "+00:00");
    await saveFoodInDay(formattedDate, savedFood, userID).catch(() => {
      return new NextResponse("There was an error while sending data to db", {
        status: 500,
      });
    });
    return new NextResponse("Successfully saved to db", { status: 201 });
  });
}
