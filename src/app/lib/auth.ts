
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { users } from "@/models/users";
import { connect } from "mongoose";

const { MONGODB_URI } = process.env;
import { NextAuthConfig } from "next-auth";
import connectDB from "@/lib/connect-db";

export const authOptions:NextAuthConfig = {
  secret:process.env.SECRET,
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log(credentials);
        await connectDB();
        console.log(credentials.password);
        debugger;
        const user = await users.findOne({
          userEmail: credentials?.email,
        }).select("+userPassword");
        console.log(user);
        const ps = credentials.password;
        if (!user) throw new Error("Wrong Email");
       // const passwordMatch = await bcrypt.compare(
        //  credentials!.password, // type asserting
         // user.userPassword
        //);
        //if (!passwordMatch) throw new Error("Wrong Password");
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};
 