import { authOptions } from "@/lib/auth";
import { getUser, updateUser } from "@/lib/user-db";
import { UsersClass } from "@/models/users";
import { getServerSession } from "next-auth";
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

    const safeUser = {
      ...user,
    };

    return NextResponse.json(safeUser);
  } else {
    return new NextResponse("Email was not specified", {
      status: 400,
    });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { email, height, weight, goal, image,name } = await req.json();

  if (!session || !session.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const currentUserEmail = session.user.email;

  if (!email) {
    return new NextResponse("Email was not specified", { status: 400 });
  }

  const user: UsersClass | null = await getUser(currentUserEmail);
  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const updatedUser = await updateUser(
    user._id,
    height,
    weight,
    goal,
    image,
    email,
    name
  );

  if ("error" in updatedUser) {
    return new NextResponse(
      `Failed to update user: ${
        (updatedUser.error as any).message || updatedUser.error
      }`,
      { status: 500 },
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
