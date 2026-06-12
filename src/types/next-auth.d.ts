import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      goal?: string;
      height?: number;
      weight?: number;
    } & DefaultSession["user"];
  }
}
