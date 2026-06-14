import { authOptions } from "@/lib/auth";
import { getUser, updateUser } from "@/lib/user-db";

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "../functions";
import { updateUserSchema } from "@/lib/validationShemas/userValidationSchema";

export async function POST(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return new NextResponse("Email was not specified", { status: 400 });
  }

  if (email) {
    const user = await getUser(email);
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }
    //post is only used once, but never ever leak the user password like this
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

export async function PATCH(req: NextRequest) {
  return withAuth(req, async () => {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    if (!session || !session.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const validationResult = updateUserSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(`Invalid input: ${validationResult.error}`, {
        status: 400,
      });
    }

    const userID = session.user.id;

    const updatedUser = await updateUser(userID, body);

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
  });
}

export async function GET(req: NextRequest) {
  return withAuth(req, async (req) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const currentUserEmail = session.user.email;

    if (!currentUserEmail) {
      return new NextResponse("Email was not specified", { status: 400 });
    }

    const user = await getUser(currentUserEmail);

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  });
}
