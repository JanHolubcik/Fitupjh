"use client";
import { Image, Link, Tooltip } from "@nextui-org/react";
import { FaInfoCircle } from "react-icons/fa";

export default function Home() {
  return (
    <main className="dark flex flex-col items-center justify-start sm:p-10 p-6">
      <div className="max-w-[550px] w-full bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <div className="max-w-[550px] flex flex-col justify-center items-center ">
          <div className="w-[300px] h-[300px]">
            <Image
              className="object-contain w-full h-full"
              alt="Hello welcome to the site"
              src="greeting_owl.png"
              width={300}
              height={300}
            />
          </div>
          <h1 className="m-3 font-bold mt-8 text-3xl text-center self-center">
            FitUp - Your Calorie Tracker
          </h1>

          <ul>
            <li className="m-3">
              <span className="font-bold">Hey there!</span> Welcome to
              FitUp—your personal companion for tracking calories and eating
              smarter.
            </li>
            <li className="m-3">
              Logging your meals is quick, easy. No complicated steps, just
              straightforward tracking that fits into your day.
            </li>
            <li className="m-3">
              We don’t just count calories—we help you understand what’s in your
              food. Get insights into your carbs, proteins, fats, and more, so
              you can make better choices for your health.
            </li>
          </ul>
          <h2 className="m-3 font-bold self-start">
            Start your journey today!
          </h2>

          <Link href="/signup">
            <button className="mt-6 px-4 py-2 rounded-xl font-bold  text-black bg-[#00FFAA] hover:scale-105 transition-transform animate-pulse">
              Start Tracking Now
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
