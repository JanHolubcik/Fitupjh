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

  return (
    <main className="flex min-h-screen flex-col items-center p-24 pt-0">
      <ProfileMainComponent images={images}></ProfileMainComponent>
    </main>
  );
}
