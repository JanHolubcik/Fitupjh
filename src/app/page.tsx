"use client";
import { Image } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="dark  flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p>Black coffe yummi</p>
        <div className="m-1 flex-none w-150 ...">
          <Image
            alt="nextui logo"
            height={100}
            radius="sm"
            src="https://www.themealdb.com/images/ingredients/Chicken.png"
            width={100}
          />
        </div>
        <h1 className="text-2xl font-bold mb-4">Food List</h1>
      </div>
    </main>
  );
}
