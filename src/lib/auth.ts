import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import client from "./mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(client.db(), {
    client,
  }),
  user: {
    changeEmail: {
      enabled: true,
    },
    additionalFields: {
      goal: { type: "string", required: false, defaultValue: "maintainWeight" },
      weight: { type: "number", required: false },
      weightGoal: { type: "number", required: false },
      height: { type: "number", required: false },
      activityLevel: {
        type: "string",
        required: false,
        defaultValue: "lightlyActive",
      },
      targetCalories: { type: "number", required: false },
      targetProtein: { type: "number", required: false },
      targetCarbs: { type: "number", required: false },
      targetFat: { type: "number", required: false },
      targetSugar: { type: "number", required: false },
      manualOverride: { type: "boolean", required: false },
      guideSeen: { type: "boolean", defaultValue: false },
    },
  },
  experimental: { joins: true },
  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
  },
});

export type AuthSessionData = Awaited<ReturnType<typeof auth.api.getSession>>;
