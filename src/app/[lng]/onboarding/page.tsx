import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import OnboardingPage from "./OnBoardingPage/OnBoardingPage";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <main className="">
      <OnboardingPage></OnboardingPage>
    </main>
  );
}
