// app/api/signup/route.js
import connectDB from "@/lib/connect-db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { User } from "@/models/users";

const validateEmail = (email: string) => {
  return email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
};

export async function POST(request: Request) {
  const { username, userEmail, password, weight, height, goal } =
    await request.json();

  if (!username || !userEmail || !password || !weight || !height) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  if (username.length < 2) {
    return NextResponse.json(
      { error: "User name is too long." },
      { status: 400 }
    );
  }

  if (weight < 0 || height < 0) {
    return NextResponse.json(
      { error: "Height or weight can't be negative." },
      { status: 400 }
    );
  }

  if (!validateEmail(userEmail)) {
    return NextResponse.json(
      { error: "Wrong format of email." },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.insertMany({
      userName: username,
      userPassword: hashedPassword,
      userEmail: userEmail,
      image: "pfps/1.png",
      weight: weight,
      height: height,
      goal: "lose weight",
    });

    return NextResponse.json(
      { message: "User created successfully", result },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
