import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // This plugin looks at your server config and unlocks your custom fields!
  plugins: [inferAdditionalFields<typeof auth>()],
});
export type Session = typeof authClient.$Infer.Session;
