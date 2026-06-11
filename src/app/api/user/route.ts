import { authOptions } from "@/lib/auth";
import { getUser, updateUser } from "@/lib/user-db";

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "../functions";

export async function POST(req: NextRequest) {
  return withAuth(req, async (req) => {
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
  });
}

export async function PATCH(req: NextRequest) {
  return withAuth(req, async (req) => {
    const session = await getServerSession(authOptions);
    const { email, height, weight, goal, image, name } = await req.json();

    if (!session || !session.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const currentUserEmail = session.user.email;

    if (!email) {
      return new NextResponse("Email was not specified", { status: 400 });
    }

    const result = await getUser(currentUserEmail);
    if (result && typeof result === "object" && "error" in result) {
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    if (!result) {
      return new NextResponse("User not found", { status: 404 });
    }

    const user = result;

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
      name,
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
  });
}
