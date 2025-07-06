import ProgressBars from "@/components/ProgressBars/ProgressBars";
import "./calendar.css"; // styling only for calendar

import fs from "fs";
import path from "path";

import { useState } from "react";
import Calendar from "react-calendar";
import ProfileInfo from "@/components/ProfileInfo/ProfileInfo";
import ProgressBarsProfile from "@/components/ProgressBarsProfile/ProgressBarsProfile";
import ProfileMainComponent from "@/components/ProfileMainComponent/ProfileMainComponent";

export async function getProfileImages(): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", "pfps");
  const files = fs.readdirSync(dir);

  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
  );

  return imageFiles.map((file) => `/pfps/${file}`);
}
export default async function Profile() {
  const images = await getProfileImages();
  return (
    <main className="flex min-h-screen flex-col items-center p-24 pt-0">
      <ProfileMainComponent images={images}></ProfileMainComponent>
    </main>
  );
}
