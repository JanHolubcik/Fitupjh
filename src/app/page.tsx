"use client";
import { Image } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="dark  flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-[550px] flex flex-col justify-center items-center">
      <Image
      
            className="flex self-center"
            alt="Cute calc"
            height={125}
            radius="sm"
            src="calc.png"
            width={125}
          />
        <h1 className="m-3 font-bold mt-8 text-3xl self-start">Welcome to FitUp - Calorie Tracker</h1>
        <h2 className="m-3 font-bold self-start">Why FitUp?</h2>
        <ul>
          <li className="m-3">
            <span className="font-bold">Simple and Intuitive:</span>{" "}
            User-friendly interface makes logging your meals quick and
            hassle-free.
          </li>
          <li className="m-3">
            <span className="font-bold">Comprehensive Food Database:</span>{" "}
            Access thousands of food items to record your intake accurately.
          </li>
          <li className="m-3">
            <span className="font-bold">Nutritional Insights:</span> Beyond
            calories, gain insight into the macronutrients in your diet for a
            more comprehensive view of your health.
          </li>
        </ul>
        <h2 className="m-3 font-bold self-start">Start your journey today!</h2>
        <p className="m-3">Take the first step towards mindful eating and a healthier you. Register and transform the way you manage your nutrition.</p>

      </div>
    </main>
  );
}
