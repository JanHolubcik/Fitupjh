"use client";

import { Spinner } from "@nextui-org/react";

import { authClient } from "@/lib/auth-client";
import AccountDetails from "./components/AccountDetails";
import { LanguageAndThemeCard } from "./components/LanguageAndThemeCard";
import { BiometricAndGoals } from "./components/BiometricAndGoals";
import { DeleteAccount } from "./components/DeteteAccount";

import { ChangePassword } from "./components/ChangePassword";

export default function ProfileMainComponent() {
  const { data } = authClient.useSession();
  const user = data?.user;

  if (!user) return <Spinner />;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col">
      <div className="md:col-span-8 flex flex-col gap-6">
        <LanguageAndThemeCard />
        <AccountDetails user={user} />
        {/* <ChangeEmail user={user} /> */}
        <ChangePassword />
        <BiometricAndGoals user={user} />
        <DeleteAccount />
      </div>
    </div>
  );
}
