


import credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { users } from "@/models/users";
import connectDB from "@/lib/connect-db";

export const authOptions = {
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
          credentials!.password as string | Buffer, // type asserting
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
