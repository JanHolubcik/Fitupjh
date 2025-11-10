import { getUser, updateUser } from "@/lib/user-db";
import { UsersClass } from "@/models/users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return new NextResponse("Email was not specified", { status: 400 });
  }

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

export async function Update(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const height = req.nextUrl.searchParams.get("height");
  const weight = req.nextUrl.searchParams.get("weight");
  const goal = req.nextUrl.searchParams.get("goal");
  const image = req.nextUrl.searchParams.get("image");

  if (!email) {
    return new NextResponse("Email was not specified", { status: 400 });
  }

  const user: UsersClass | null = await getUser(email);
  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const updatedUser = await updateUser(
    height ? Number(height) : undefined,
    weight ? Number(weight) : undefined,
    goal || undefined,
    image || undefined,
    email
  );

  if ("error" in updatedUser) {
    return new NextResponse(
      `Failed to update user: ${
        (updatedUser.error as any).message || updatedUser.error
      }`,
      { status: 500 }
    );
  }

  if (
    "message" in updatedUser &&
    updatedUser.message === "No fields to update"
  ) {
    return new NextResponse("No fields to update", { status: 400 });
  }

  return NextResponse.json(updatedUser);
}
