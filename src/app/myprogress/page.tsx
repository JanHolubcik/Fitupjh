"use server";

import MyGraph from "./MyGraph";

export default async function MyProgress() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 pt-0 bg-black">
      <MyGraph />
    </main>
  );
}
