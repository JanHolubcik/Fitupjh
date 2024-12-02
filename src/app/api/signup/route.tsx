// app/api/signup/route.js
import connectDB from "@/lib/connect-db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { users } from "@/models/users";

const validateEmail = (email: string) => {
  return email.match(
   /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  );
};

export async function POST(request: Request) {
  const { username, userEmail, password, weight, height, goal } =
    await request.json();

  if (!username || !userEmail || !password || !weight || !height) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!validateEmail(userEmail)) {
    return NextResponse.json(
      { error: "Wrong format of email" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the collection
    console.log("Creating user record...");
    const result = await users.insertMany({
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
    console.log(error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
