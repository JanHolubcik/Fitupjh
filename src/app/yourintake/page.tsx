import TimeFrame from "@/components/TimeFrame";
import { getFood } from "@/lib/food-db";
import { Button } from "@nextui-org/react";
import Image from "next/image";

const timeFrames = ["Breakfast", "Lunch", "Dinner", "Supper"];

const  findInDatabase= async (searchValue: string) => {
  'use server'
  
  const food = await getFood(searchValue).then((response)=>{
      return response;
    });
   
    return food;
  };

export default function Food() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {timeFrames.map((key) => (
          <TimeFrame key={key} timeOfDay={key} findInDatabase={findInDatabase}/>
        ))}
      </div>
    </main>
  );
}
