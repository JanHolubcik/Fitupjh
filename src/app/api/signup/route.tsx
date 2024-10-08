// app/api/signup/route.js
import connectDB from '@/lib/connect-db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { users } from '@/models/users';

export async function POST(request: Request) {
    const { username, userEmail, password } = await request.json();

    if (!username || !userEmail || !password) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        await connectDB();


        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the collection
        console.log("Creating new food record...");
        const result = await users.insertMany({
            userName: username,
            userPassword: hashedPassword,
            userEmail: userEmail,
        });
        
        return NextResponse.json(
            { message: 'User created successfully',  result },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
    }
}