import { NextRequest, NextResponse } from "next/server";

import { isValid, parseISO } from "date-fns";
import { withAuth } from "../functions";
import { auth } from "@/lib/auth";
import { checkForSavedActivitiesMonth } from "@/lib/mongo/activity-db";

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const dateTo = req.nextUrl.searchParams.get("dateTo");
    const dateFrom = req.nextUrl.searchParams.get("dateFrom");

    const authData = await auth.api.getSession({
      headers: req.headers,
    });

    const userID = authData?.user.id;

    if (!userID || typeof userID !== "string") {
      return new NextResponse("Missing or invalid userID", { status: 400 });
    }

    if (!dateTo) {
      return new NextResponse("Missing or invalid dateTo", { status: 400 });
    }

    const dTo = parseISO(dateTo);
    if (!isValid(dTo)) {
      return new NextResponse("Invalid dateFrom format", { status: 400 });
    }

    if (dateTo && userID && dateFrom) {
      const food = await checkForSavedActivitiesMonth(dateFrom, dateTo, userID);

      return NextResponse.json(food);
    } else {
      return new NextResponse("Error getting saved food from user", {
        status: 500,
      });
    }
  });
}
