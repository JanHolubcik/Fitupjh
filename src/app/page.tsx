"use client";
import {
  decrement,
  increment,
  selectCount,
} from "@/features/counter/counterSlice";
import {
  selectSavedFoodByDate,
  setSavedFoodMonth,
} from "@/features/savedFoodslice/savedFoodSlice";
import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { Button, Image, Link } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const { status, data } = useSession();
  const dispatch = useDispatch();
  const count = useSelector(selectCount);

  const { data: monthData, isSuccess } = useQuery(
    LastMonthFoodOptions(
      data?.user?.id || "",
      "",
      format(new Date(), "yyyy-MM-dd")
    )
  );

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

          <Link href={data?.user?.id ? "/yourintake" : "signup"}>
            <button className="mt-6 px-4 py-2 rounded-xl font-bold  text-black bg-[#00FFAA] hover:scale-105 transition-transform animate-pulse">
              Start Tracking Now
            </button>
          </Link>
          <Button
            onPress={() => dispatch(increment())}
            className="mt-4 px-4 py-2 rounded-xl font-bold  text-black bg-[#FFAA00] hover:scale-105 transition-transform animate-pulse"
          >
            +
          </Button>
          <span className="text-xl font-bold">{count}</span>
          <Button
            onPress={() => dispatch(decrement())}
            className="mt-4 px-4 py-2 rounded-xl font-bold  text-black bg-[#FFAA00] hover:scale-105 transition-transform animate-pulse"
          >
            -
          </Button>
        </div>
      </div>
    </main>
  );
}
