import { useYourIntakeContext } from "@/hooks/YourIntakeContext";
import { searchFood } from "@/lib/YourIntake/search-db";
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
import React, { Dispatch, useEffect, useRef } from "react";
import { useState } from "react";
import { FaPlusCircle, FaSearch } from "react-icons/fa";

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
  onOpenChange: () => void;
  isOpen: boolean | undefined;
  timeOfDay?: "breakfast" | "lunch" | "dinner";
};

type timeOfDay = "breakfast" | "lunch" | "dinner";

function useDebounce<T>(
  value: T,
  delay: number,
  setLoading: Dispatch<React.SetStateAction<boolean>>
) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay, setLoading]);

  return debouncedValue;
}

export const ModalFindFood = (props: props) => {
  const { addToFood } = useYourIntakeContext();
  const isSubmittingRef = useRef(false);
  const [food, setFood] = useState<ReturnTypeFood>([]);
  const [calculatedCalories, setCalculatedCalories] = useState<number[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500, setLoading);

  useEffect(() => {
    if (debouncedSearchTerm.length === 0) {
      setFood([]);
      setLoading(false);
      return;
    }

    const fetchFood = async () => {
      setLoading(true);

      const foundFood = await searchFood(debouncedSearchTerm);

      setFood(foundFood.food || []);
      if (foundFood.food) {
        setCalculatedCalories(
          foundFood.food.map((key) => key.calories_per_100g)
        );
      }

      setLoading(false);
    };

    fetchFood();
  }, [debouncedSearchTerm]);

  const getTimeOfDay = () => {
    const now = new Date();
    const hour = now.getHours();

    switch (true) {
      case hour >= 0 && hour < 8:
        return "breakfast";

      case hour >= 8 && hour < 16:
        return "lunch";

      case hour >= 16 && hour < 24:
        return "dinner";

      default:
        return "lunch";
    }
  };

  const AddFood = (
    id: number,
    key: {
      name: string;
      calories_per_100g: number;
      fat: number;
      protein: number;
      sugar: number;
      carbohydrates: number;
      fiber: number;
      salt: number;
    },
    onClose: () => void
  ) => {
    const valueGrams = (
      document.getElementById(`${id}inputGrams`) as HTMLInputElement
    ).value;
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    addToFood(
      calculatedCalories[id],
      key.name,
      props.timeOfDay ?? getTimeOfDay(),
      valueGrams,
      key.fat,
      key.protein,
      key.sugar,
      key.carbohydrates,
      key.fiber,
      key.salt
    );
    onClose();
    setSearchTerm("");
    // unlock AFTER modal is fully gone
    setTimeout(() => {
      isSubmittingRef.current = false;
    }, 300); // match modal animation duration
  };

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
      motionProps={{
        variants: {
          enter: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1 },
        },
        transition: {
          enter: { duration: 0.15 }, // animate when opening
          exit: { duration: 0 }, // instant close
        },
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                {loading ? (
                  <Spinner className=" m-2 self-center" size="lg" />
                ) : (
                  <>
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
                            onPress={() => AddFood(id, key, onClose)}
                            disabled={isSubmittingRef.current}
                            isIconOnly
                          >
                            <FaPlusCircle />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
