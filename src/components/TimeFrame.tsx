"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Button,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { FaPlusCircle, FaSearch } from "react-icons/fa";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { PiArrowSquareDownRightLight } from "react-icons/pi";
import { TbLayoutBottombarExpand, TbLayoutNavbarExpand } from "react-icons/tb";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import FoodInfo from "./FoodInfo";
type Food = {
  timeOfDay: string;
  image?: File;
};

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
      console.log(food);
      return food;
    }
  });
};

const addFood = (props: foodType) => {};

const NavbarComponent = (props: Food) => {
  const [savedFood, setSavedFood] = useState<foodType>([]);
  const [food, setfood] = useState<foodType>(foods);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Card className="max-w-[500px] min-w-[400px] p-2 mt-5">
      <CardHeader>
        <h1>{props.timeOfDay}</h1>
      </CardHeader>
      <CardBody className="flex-col items-end">
        {savedFood &&
          savedFood.map((key) => (
            <div key={key.name}>
              <p>{key.name}</p>
            </div>
          ))}
        <Button onPress={onOpen} isIconOnly>
          <FaPlusCircle />
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <Input
                    classNames={{
                      base: "max-w-full sm:max-w-[50rem] h-10",
                      mainWrapper: "h-full",
                      input: "text-small",
                      inputWrapper:
                        "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                    }}
                    placeholder="Type to search..."
                    onChange={(event) => {
                      console.log(event.target.value);
                      setfood(findInFood(foods, event.target.value));
                    }}
                    onClear={() => setfood(foods)}
                    size="sm"
                    startContent={<FaSearch size={18} />}
                    type="search"
                  />
                </ModalHeader>
                <ModalBody>
                  {food.map((key) => (
                    <div className=" flex flex-row " key={key.name}>
                      <div className="flex-1 self-center">
                        <p>{key.name}</p>
                      </div>
                      <div className="flex-1 text-end">
                        <Button
                          onPress={() =>
                            setSavedFood((prevState) => {
                              return [...prevState, key];
                            })
                          }
                          isIconOnly
                        >
                          <FaPlusCircle />
                        </Button>
                      </div>
                    </div>
                  ))}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default NavbarComponent;
