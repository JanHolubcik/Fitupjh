import "./calendar.css"; // styling only for calendar

import fs from "fs";
import path from "path";
import { format } from "date-fns";

import ProfileMainComponent from "@/components/ProfileMainComponent/ProfileMainComponent";
import { getQueryClient } from "@/get-query-client";
import { authOptions } from "@/lib/auth";
import { DailyIntakeOptions } from "@/lib/queriesOptions/DailyIntakeOptions";
import { getServerSession } from "next-auth";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

async function getProfileServerImages(): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", "pfps");
  const files = fs.readdirSync(dir);

  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
  );

  return imageFiles.map((file) => `/pfps/${file}`);
}
export default async function Profile() {
  const images = await getProfileServerImages();
  const session = await getServerSession(authOptions);
  const queryClient = getQueryClient();

  if (session?.user?.id) {
    const userId = session.user.id;
    const today = format(new Date(), "dd.MMM.yyyy");

    await queryClient.prefetchQuery(DailyIntakeOptions(userId, today));
  }
  return (
    <main className="flex min-h-screen flex-col items-center p-24 pt-0">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProfileMainComponent images={images}></ProfileMainComponent>
      </HydrationBoundary>
    </main>
  );
}
