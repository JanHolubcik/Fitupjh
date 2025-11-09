import { getUser } from "@/lib/user-db";
import { UsersClass } from "@/models/users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (email) {
    const user: UsersClass | null = await getUser(email);
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    //if for some reason password got into response
    const safeUser = {
      ...user,
      userPassword: undefined,
    };

    return NextResponse.json(safeUser);
  } else {
    return new NextResponse("Email was not specified", {
      status: 400,
    });
  }
}
