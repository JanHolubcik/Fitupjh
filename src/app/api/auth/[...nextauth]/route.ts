import { authOptions } from "@/app/lib/auth";
import NextAuth from "next-auth";
export const { auth, signIn,  signOut, handlers: { GET, POST } }  = NextAuth(authOptions);

