"use client";
import { format } from "date-fns";

import FoodInfo from "@/components/FoodInfo";
import { getSavedFoodInDay } from "@/lib/food-db";
import { saveFoodToDatabase } from "@/lib/YourIntake/saveFoodToDatabase-db";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Fa42Group, FaApple } from "react-icons/fa6";
import { foodType as XD } from "@/types/foodTypes";
const foods = [
  {
    name: "Chicken",
    description:
      "Food / Beverages > Meat / Poultry / Seafood / Meat Substitutes (Perishable) > Unprepared / Unprocessed Animal Products > Chicken > Chicken Breasts",
  },
  {
    name: "IceCream",
    description:
      "Food / Beverages > Frozen Foods > Desserts (Frozen) > Ice Cream / Non-Dairy Desserts / Yogurt (Frozen)",
  },
  {
    name: "Pizza",
    description:
      "Food / Beverages > Bakery / Deli > Prepared & Preserved Foods > Pizza (Perishable)",
  },
  {
    name: "Potato",
    description:
      "Food / Beverages > Bakery / Deli > Prepared & Preserved Foods > Pizza (Perishable)",
  },
  {
    name: "Tomato",
    description:
      "Food / Beverages > Bakery / Deli > Prepared & Preserved Foods > Pizza (Perishable)",
  },
];

type foodType = typeof foods;

const xdd = {
  breakfast: [{ id: 0, name: "Chicken", calories: 150, amount: "20" }],
  lunch: [],
  dinner: [],
};

const findInFood = (props: foodType, searchValue: string) => {
  return props.filter((food) => {
    if (food.name.toLowerCase().includes(searchValue.toLowerCase())) {
      return food;
    }
  });
};

export default function Food(props: any) {
  //until i have data from database we will use state with food array
  const [food, setfood] = useState<foodType>(foods);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <div>
        <Button
          size="lg"
          onPress={() => {
            saveFoodToDatabase(new Date(2024, 11, 12), xdd);
          }}
          isIconOnly
        >
          <FaApple />
        </Button>
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[60rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          onChange={(event) => {
            setfood(findInFood(foods, event.target.value));
          }}
          onClear={() => setfood(foods)}
          size="sm"
          startContent={<FaSearch size={18} />}
          type="search"
        />
        {food.map((key) => (
          <FoodInfo
            key={key.name}
            name={key.name}
            description={key.description}
          />
        ))}
      </div>
    </main>
  );
}
