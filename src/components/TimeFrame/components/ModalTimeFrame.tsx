import { FoodClass } from "@/models/Food";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { FlattenMaps, Types } from "mongoose";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { FaPlusCircle, FaSearch } from "react-icons/fa";

type foodType = {
  breakfast: food;
  lunch:food;
  dinner:food;
}

type food = {
  id: number;
  name: string;
  calories: number;
  amount: string;
}[];

type ReturnTypeFood =
  | (FlattenMaps<FoodClass> &
      Required<{
        _id: string | Types.ObjectId;
      }>)[]
  | undefined;

type props = {
  timeOfDay: 'breakfast' | 'dinner' | 'lunch',
  setSavedFood: Dispatch<
    SetStateAction<
    foodType
    >
  >;
  onOpenChange: () => void;
  isOpen: boolean | undefined;
  findInDatabase: (searchValue: string) => Promise<
    | {
        food: ReturnTypeFood;
        error?: undefined;
      }
    | {
        error: unknown;
        food?: undefined;
      }
  >;
};

export const ModalTimeFrame = (props: props) => {
  //finding food in database
  const idIncrement = useRef(0);
  const [food, setFood] = useState<ReturnTypeFood>([]);
  const [calculatedCalories, setCalculatedCalories] = useState<number[]>([]);

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
                  props.findInDatabase(event.target.value).then((foundFood) => {
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
                      id={id + "inputGrams"}
                      min={0}
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
                        props.setSavedFood((prevState) => {
                          const valueGrams = (
                            document.getElementById(
                              `${id}inputGrams`
                            ) as HTMLInputElement
                          ).value;

                          const newState = prevState;
                          newState[props.timeOfDay] = [
                            ...prevState[props.timeOfDay] ,
                            {
                              id: idIncrement.current,
                              name: key.name,
                              calories: calculatedCalories[id],
                              amount: valueGrams,
                            },
                          ];

                          return newState;
                        });
                        ++idIncrement.current;
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
      </ModalContent>
    </Modal>
  );
};
