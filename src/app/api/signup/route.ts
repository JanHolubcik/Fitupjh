import connectDB from "@/lib/connect-db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { User } from "@/models/users";
import { signupSchema } from "@/lib/validationShemas/signupValidationSchema";

const validateEmail = (email: string) => {
  return email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
};

export async function POST(request: NextRequest) {
  //return withAuth(request, async (request) => {
  const body = await request.json();
  const validationResult = signupSchema.safeParse(body);
  if (!validationResult.success) {
    return new NextResponse(`Invalid input: ${validationResult.error}`, {
      status: 400,
    });
  }
  const { username, userEmail, password, weight, height } = body;

  if (!username || !userEmail || !password || !weight || !height) {
    return NextResponse.json(
      { error: "errors.missingFields" },
      { status: 400 },
    );
  }

  if (username.length < 2) {
    return NextResponse.json(
      { error: "errors.usernameTooShort" },
      { status: 400 },
    );
  }

  if (weight < 0 || height < 0) {
    return NextResponse.json(
      { error: "errors.negativeDimensions" },
      { status: 400 },
    );
  }

  if (!validateEmail(userEmail)) {
    return NextResponse.json(
      { error: "errors.wrongEmailFormat" },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({
      $or: [{ userEmail: userEmail }, { userName: username }],
    });

    if (existingUser) {
      return NextResponse.json({ error: "errors.userExists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.insertMany({
      userName: username,
      userPassword: hashedPassword,
      userEmail: userEmail,
      image: "pfps/1.png",
      weight: weight,
      height: height,
      goal: "maintainWeight",
      activityLevel: "lightlyActive",
    });

    return NextResponse.json(
      { message: "User created successfully", result },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: "errors.serverError" }, { status: 500 });
  }
  // });
}
