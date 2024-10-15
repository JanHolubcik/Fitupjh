import { connectDB } from "@/lib/mongodb";

import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { SavedFood } from "@/models/savedFood";
import { users } from "@/models/users";

export const authOptions: NextAuthOptions = {
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await users.findOne({
          email: credentials?.email,
        }).select("+password");
        if (!user) throw new Error("Wrong Email");
        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          user.userPassword
        );
        if (!passwordMatch) throw new Error("Wrong Password");
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};
