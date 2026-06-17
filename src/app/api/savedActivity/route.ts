import { NextRequest, NextResponse } from "next/server";

import {
  checkForSavedActivities,
  saveActivitiesInDay,
} from "@/lib/mongo/activity-db";
import { isValid, parse } from "date-fns";
import { withAuth } from "../functions";
import { LoggedActivityType } from "@/features/DashboardSlice/DashboardSlice";

type SaveActivityRequest = {
  date: string; // "yyyy-MM-dd"
  activities: LoggedActivityType[];
  userID: string;
};

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const date = req.nextUrl.searchParams.get("date");
    const userID = req.nextUrl.searchParams.get("user_id");

    if (!date) {
      return new NextResponse("Missing or invalid date", { status: 400 });
    }

    const parsedDate = parse(date, "yyyy-MM-dd", new Date());
    if (!isValid(parsedDate)) {
      return new NextResponse("Invalid date format", { status: 400 });
    }

    if (!userID || typeof userID !== "string") {
      return new NextResponse("Missing or invalid userID", { status: 400 });
    }

    const res = await checkForSavedActivities(date, userID);

    if (!res || !res.activities) {
      return NextResponse.json([]);
    }

    return NextResponse.json(res.activities);
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    const { date, activities, userID } =
      (await req.json()) as SaveActivityRequest;

    if (!date) {
      return new NextResponse("Missing or invalid date", { status: 400 });
    }

    if (!activities || !Array.isArray(activities)) {
      return new NextResponse("Missing or invalid activities array", {
        status: 400,
      });
    }

    if (!userID || typeof userID !== "string") {
      return new NextResponse("Missing or invalid userID", { status: 400 });
    }

    const parsedDate = parse(date, "yyyy-MM-dd", new Date());
    if (!isValid(parsedDate)) {
      return new NextResponse("Invalid date format", { status: 400 });
    }

    try {
      await saveActivitiesInDay(date, activities, userID);
      return new NextResponse("Successfully saved to db", { status: 201 });
    } catch (error) {
      console.error("Database save error:", error);
      return new NextResponse("There was an error while sending data to db", {
        status: 500,
      });
    }
  });
}
