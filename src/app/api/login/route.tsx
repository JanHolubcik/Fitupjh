// app/api/signup/route.js
import connectDB from "@/lib/connect-db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { users } from "@/models/users";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("userName");
  const password = searchParams.get("password");

  if (!username || !password) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const existingRecord = await users.findOne({
      userName: username,
    });
    // Hash the password

    console.log("Trying to find existing user...");
    // Insert user into the collection
    if (existingRecord?.userPassword) {
      return await bcrypt
        .compare(password, existingRecord.userPassword)
        .then((find: boolean) => {
          return find
            ? NextResponse.json(
                { message: "Correct credentials!", existingRecord },
                { status: 201 }
              )
            : NextResponse.json(
                { message: "User may not exist", existingRecord },
                { status: 201 }
              );
        })
        .finally(() => {
          console.log("Password checked!");
        });
    }
    return NextResponse.json(
      { message: "Correct credentials", existingRecord },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
