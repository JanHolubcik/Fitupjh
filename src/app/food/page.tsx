"use client";

import FoodInfo from "@/components/FoodInfo";
import { saveFood } from "@/lib/YourIntake/saveFoodToDatabase-db";

import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

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
        <Button
          onPress={() => {
            saveFood(
              "08.11.2024",
              {
                breakfast: [
                  {
                    id: 0,
                    name: "Banana",
                    calories: 89,
                    amount: "100",
                    fat: 0.3,
                    protein: 1.1,
                    sugar: 12.2,
                    carbohydrates: 22.8,
                    fiber: 2.6,
                    salt: 0,
                  },
                ],
                lunch: [],
                dinner: [],
              },
              "672baa7b6b22d548e47b9fbf"
            );
          }}
        ></Button>
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
