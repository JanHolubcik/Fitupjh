import { NextRequest, NextResponse } from "next/server";
import { checkForSavedFoodMonth } from "@/lib/food-db";

import { isValid, parseISO, subDays } from "date-fns";
import { withAuth } from "../functions";

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const dateTo = req.nextUrl.searchParams.get("dateTo");
    const dateFrom = req.nextUrl.searchParams.get("dateFrom");
    const userID = req.nextUrl.searchParams.get("user_id");

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

    let dFrom: Date;

    if (!dateFrom) {
      dFrom = subDays(dTo, 30);
    } else {
      dFrom = parseISO(dateFrom);

      if (!isValid(dTo)) {
        return new NextResponse("Invalid dateTo format", { status: 400 });
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
  });
}
