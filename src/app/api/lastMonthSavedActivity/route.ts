import { NextRequest, NextResponse } from "next/server";
import { checkForSavedFoodMonth } from "@/lib/mongo/food-db";

import { isValid, parseISO, subDays } from "date-fns";
import { withAuth } from "../functions";
import { auth } from "@/lib/auth";

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
