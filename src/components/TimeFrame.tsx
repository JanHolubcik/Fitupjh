"use client";
import { Card, CardHeader, CardBody, Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { FaPlusCircle, FaSearch } from "react-icons/fa";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

import { FlattenMaps, ObjectId, Types } from "mongoose";
import { FoodClass } from "@/models/Food";

type xd =
  | (FlattenMaps<FoodClass> &
      Required<{
        _id: string | Types.ObjectId;
      }>)[]
  | undefined;

type Food = {
  timeOfDay: string;
  findInDatabase: (searchValue: string) => Promise<
    | {
        food: (FlattenMaps<FoodClass> &
          Required<{
            _id: string | Types.ObjectId;
          }>)[];
        error?: undefined;
      }
    | {
        error: unknown;
        food?: undefined;
      }
  >;
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

const addFood = (props: foodType) => {};

const TimeFrame = (props: Food) => {
  //when this state changes, we sent data to server
  const [savedFood, setSavedFood] = useState<foodType>([]);
  const [food, setFood] = useState<xd>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [calculatedCalories, setCalculatedCalories] = useState<number[]>([]);
  const [xd, setXD] = useState(0);
  //const xd = createRef();
  console.log(calculatedCalories);

  return (
    <Card className="max-w-[500px] min-w-[400px] p-2 mt-5">
      <CardHeader>
        <h1>{props.timeOfDay}</h1>
      </CardHeader>
      <CardBody className="flex-col items-end">
        {savedFood &&
          savedFood.map((key, id) => (
            <div key={id}>
              <p>{key.name}</p>
            </div>
          ))}
        <Button onPress={onOpen} isIconOnly>
          <FaPlusCircle />
        </Button>
        <Modal
          hideCloseButton
          size="lg"
          scrollBehavior="inside"
          isOpen={isOpen}
          onOpenChange={() => {
            setFood([]);
            onOpenChange();
          }}
        >
          <ModalContent>
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
                    if (event.target.value.length === 0) {
                      setFood([]);
                    } else {
                      props
                        .findInDatabase(event.target.value)
                        .then((foundFood) => {
                          setFood(foundFood.food);
                          if (foundFood.food)
                            setCalculatedCalories(
                              foundFood.food.map((key) => {
                                return key.calories_per_100g;
                              })
                            );
                        });
                    }
                  }}
                  onClear={() => setFood([])}
                  size="sm"
                  startContent={<FaSearch size={18} />}
                  type="search"
                />
              </ModalHeader>
              <ModalBody className="max-h-52">
                <div className="max-h-52 overflow-visible">
                  {food?.length !== 0 && (
                    <div className=" flex flex-row ">
                      <div className="flex-1 self-center">
                        <p>Name</p>
                      </div>
                      <div className="flex-1 self-center max-w-11">
                        <p>grams</p>
                      </div>
                      <div className="flex-1 ml-10  self-center text-center max-w-11">
                        <p>cal</p>
                      </div>
                      <div className="max-w-11 ml-10   flex-1 text-end">
                        <div></div>
                      </div>
                    </div>
                  )}
                  {food?.map((key, id) => (
                    <div className=" flex flex-row " key={id}>
                      <div className="flex-1 self-center">
                        <p>{key.name}</p>
                      </div>
                      <div className="flex-1 self-center max-w-11">
                        <Input
                          key={id + "inputGrams"}
                          min={0}
                          defaultValue="100"
                          size="sm"
                          type="number"
                          onChange={(event) => {
                            console.log("xe:" + event.target.value);
                            setCalculatedCalories((prevState) => {
                              const newState = [...prevState];
                              if (event.target.value !== null)
                                newState[id] =
                                  (Number(event.target.value) / 100) *
                                  key.calories_per_100g;
                              return newState;
                            });
                          }}
                        />
                      </div>
                      <div className="flex-1 ml-10  self-center text-end max-w-11">
                        <Input
                          disabled
                          id={id + "readOnlyInput"}
                          min={0}
                          value={calculatedCalories[id].toString()}
                          size="sm"
                          type="number"
                        />
                      </div>

                      <div className="max-w-11 ml-10   flex-1 text-end">
                        <Button
                          onPress={() =>
                            setSavedFood((prevState) => {
                              return [
                                ...prevState,
                                {
                                  name: key.name,
                                  description:
                                    calculatedCalories[id].toString(),
                                },
                              ];
                            })
                          }
                          isIconOnly
                        >
                          <FaPlusCircle />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ModalBody>
            </>
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default TimeFrame;
