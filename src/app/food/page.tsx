import FoodInfo from "@/components/FoodInfo";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
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

];

export default function Food() {
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
          size="sm"
          startContent={<FaSearch size={18} />}
          type="search"
        />
        {foods.map((key)=>(
          <FoodInfo name={key.name} description={key.description}/>
        ))}
        
      </div>
    </main>
  );
}
