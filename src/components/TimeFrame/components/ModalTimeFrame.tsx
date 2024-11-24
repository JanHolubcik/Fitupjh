import { useYourIntakeContext } from "@/hooks/YourIntakeContext";
import { FoodClass } from "@/models/Food";
import { foodType } from "@/types/foodTypes";
import { findInDatabase } from "@/lib/YourIntake/search-db";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  Image,
  Spinner,
} from "@nextui-org/react";
import { FlattenMaps, Types } from "mongoose";
import React, { useContext } from "react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { FaPlusCircle, FaSearch } from "react-icons/fa";
import { useSession } from "next-auth/react";

type ReturnTypeFood =
  | {
      name: string;
      calories_per_100g: number;
      fat: number;
      protein: number;
      sugar: number;
      carbohydrates: number;
      fiber: number;
      salt: number;
    }[]
  | undefined;

type props = {
  timeOfDay: "breakfast" | "dinner" | "lunch";
  onOpenChange: () => void;
  isOpen: boolean | undefined;
};

export const ModalTimeFrame = (props: props) => {
  //finding food in database
  const { addToFood } = useYourIntakeContext();
  const [food, setFood] = useState<ReturnTypeFood>([]);
  const [calculatedCalories, setCalculatedCalories] = useState<number[]>([]);
  const { data } = useSession();
  const [loading, setLoading] = useState<boolean>();
  return (
    <Modal
      placement="top"
      hideCloseButton
      size="lg"
      scrollBehavior="inside"
      isOpen={props.isOpen}
      onOpenChange={() => {
        setFood([]);
        props.onOpenChange();
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <Input
                autoFocus
                classNames={{
                  base: "max-w-full sm:max-w-[50rem] h-10",
                  mainWrapper: "h-full",
                  input: "text-small",
                  inputWrapper:
                    "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                }}
                placeholder="Type to search..."
                onChange={async (event) => {
                  if (event.target.value.length === 0) {
                    setFood([]);
                  } else {
                    setLoading(true);
                    if (data?.user?.id) {
                      await findInDatabase(
                        event.target.value,
                        data?.user?.id
                      ).then((foundFood) => {
                        setFood(foundFood.food);
                        if (foundFood.food)
                          setCalculatedCalories(
                            foundFood.food.map((key) => {
                              return key.calories_per_100g;
                            })
                          );
                      });
                    }
                    setLoading(false);
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
                {!loading && food?.length !== 0 && (
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
                {loading && <Spinner></Spinner>}
                {food?.map((key, id) => (
                  <div className=" flex flex-row " key={id}>
                    <div className="flex-1 self-center">
                      <Tooltip
                        content={
                          <Image
                            alt="nextui logo"
                            height={100}
                            radius="sm"
                            src={
                              "https://www.themealdb.com/images/ingredients/" +
                              key.name +
                              ".png"
                            }
                            width={100}
                          />
                        }
                      >
                        <p>{key.name}</p>
                      </Tooltip>
                    </div>
                    <div className="flex-1 self-center max-w-11">
                      <Input
                        key={id + "inputGrams"}
                        id={id + "inputGrams"}
                        min={0}
                        max={999}
                        defaultValue="100"
                        size="sm"
                        type="number"
                        onChange={(event) => {
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
                        onPress={() => {
                          const valueGrams = (
                            document.getElementById(
                              `${id}inputGrams`
                            ) as HTMLInputElement
                          ).value;

                          addToFood(
                            calculatedCalories[id],
                            key.name,
                            props.timeOfDay,
                            valueGrams,
                            key.fat,
                            key.protein,
                            key.sugar,
                            key.carbohydrates,
                            key.fiber,
                            key.salt
                          );
                          onClose();
                        }}
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
        )}
      </ModalContent>
    </Modal>
  );
};
