import credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { User as UserModel } from "@/models/users";

import { User, NextAuthOptions, getServerSession } from "next-auth";
import connectDB from "@/lib/connect-db";

import { type DefaultSession } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user?: {
      goal?: string;
      height?: number;
      weight?: number;
    } & User;
  }
}
const isProd = process.env.NODE_ENV === "production";
const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await UserModel.findOne({
          userEmail: credentials?.email,
        }).select("+userPassword");

        if (!user) throw new Error("Wrong Email");
        const passwordMatch = await bcrypt.compare(
          credentials!.password as string | Buffer, // type asserting
          user.userPassword
        );
        if (!passwordMatch) throw new Error("Wrong Password");

        return {
          _id: user._id,
          name: user.userName,
          email: user.userEmail,
          // user.userEmail is empty even tho i have it in database, no idea how
          //im not getting this value, but since if the email would not be found in database
          //the login attempt would throw error so we can for sure know the user have this email.
          image: user.image ? user.image : "pfps/1.png",
          id: user._id.toString(),
          goal: user.goal,
          height: user.height,
          weight: user.weight,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },

  ...(isProd && {
    cookies: {
      sessionToken: {
        name: `__Secure-next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: true,
        },
      },
    },
  }),
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user;
      }
      if (trigger === "update" && session?.user.weight) {
        // Note, that `session` can be any arbitrary object, remember to validate it!

        token.user = {
          ...(token.user ?? {}),
          ...(session.user ?? {}),
        };
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user as AdapterUser;

      return session;
    },
  },
};

const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
