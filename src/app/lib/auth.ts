import credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { users } from "@/models/users";
import { connect } from "mongoose";

const { MONGODB_URI } = process.env;
import { NextAuthConfig, User } from "next-auth";
import connectDB from "@/lib/connect-db";

import { type DefaultSession } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user?: {
      id: string;
      goal?: string | unknown;
      height?: string | unknown;
      weight?: string | unknown;
    } & User;
  }
}

export const authOptions: NextAuthConfig = {
  secret: process.env.SECRET,

  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await connectDB();

        const user = await users
          .findOne({
            userEmail: credentials?.email,
          })
          .select("+userPassword");

        if (!user) throw new Error("Wrong Email");
        const passwordMatch = await bcrypt.compare(
          credentials!.password as string | Buffer, // type asserting
          user.userPassword
        );
        if (!passwordMatch) throw new Error("Wrong Password");
        return {
          goal: "Lose weight",
          height: user.weight,
          weight: user.weight,
          _id: user._id,
          name: user.userName,
          email: credentials!.email as string,
          // user.userEmail is empty even tho i have it in database, no idea how
          //im not getting this value, but since if the email would not be found in database
          //the login attempt would throw error so we can for sure know the user have this email.
          image: user.image ? user.image : "pfps/1.png",
          id: user._id.toString(),
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as AdapterUser;
      return session;
    },
  },
};
