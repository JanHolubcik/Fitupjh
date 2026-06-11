import "./calendar.css"; // styling only for calendar

import fs from "fs";
import path from "path";

import ProfileMainComponent from "@/components/ProfileMainComponent/ProfileMainComponent";

async function getProfileServerImages(): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", "pfps");
  const files = fs.readdirSync(dir);

  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|webp|gif)$/i.test(file),
  );

  return imageFiles.map((file) => `/pfps/${file}`);
}
export default async function Profile() {
  const images = await getProfileServerImages();

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 bg-default-50/50">
      <ProfileMainComponent />
    </main>
  );
}
