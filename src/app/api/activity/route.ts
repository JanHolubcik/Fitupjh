import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "../functions";

import { getActivity } from "@/lib/mongo/activity-db";

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const activityData = await getActivity();

      return NextResponse.json(activityData, { status: 200 });
    } catch (error) {
      console.error("Database error:", error);
      return new NextResponse("There was an error while sending data to db", {
        status: 500,
      });
    }
  });
}
