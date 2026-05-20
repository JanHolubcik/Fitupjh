import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { searchFood } from "@/lib/YourIntake/search-db";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import React, { Dispatch, useEffect, useRef } from "react";
import { useState } from "react";
import { FaPlusCircle, FaSearch } from "react-icons/fa";
import { ModalCreateFood } from "./ModalCreateFood";
import { ReturnTypeFood } from "@/types/Types";
import AddFoodComponent from "./AddFoodComponent";
import { getTimeOfDay } from "@/app/constants/FunctionsHelper";

type props = {
  onOpenChange: () => void;
  isOpen: boolean | undefined;
  timeOfDay?: "breakfast" | "lunch" | "dinner";
};

function useDebounce<T>(
  value: T,
  delay: number,
  setLoading: Dispatch<React.SetStateAction<boolean>>,
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
  const { addToFood } = useYourIntakeOperations();
  const isSubmittingRef = useRef(false);
  const [food, setFood] = useState<ReturnTypeFood>([]);
  const [calculatedCalories, setCalculatedCalories] = useState<number[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500, setLoading);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
          foundFood.food.map((key) => key.calories_per_100g),
        );
      }

      setLoading(false);
    };

    fetchFood();
  }, [debouncedSearchTerm]);

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
      imgUrl: string;
    },
    valueGrams: string,
    onClose: () => void,
  ) => {
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
      key.salt,
      key.imgUrl,
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
      size="3xl"
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
                {loading ? (
                  <Spinner className=" m-2 self-center" size="lg" />
                ) : (
                  <>
                    {food?.map((key, id) => (
                      <AddFoodComponent
                        key={key.name}
                        id={id}
                        macros={key}
                        calculatedCalories={calculatedCalories}
                        setCalculatedCalories={setCalculatedCalories}
                        AddFood={AddFood}
                        onClose={onClose}
                      />
                    ))}
                    {searchTerm.length > 0 && food?.length === 0 && (
                      <div className="flex flex-row">
                        <Button
                          onPress={onOpen}
                          disabled={isSubmittingRef.current}
                          isIconOnly
                        >
                          <FaPlusCircle />
                        </Button>
                        <ModalCreateFood
                          isOpen={isOpen}
                          onOpenChange={onOpenChange}
                        ></ModalCreateFood>
                        <p className="ml-5 text-center self-center">
                          If you didn't find your food, you can add it here.
                        </p>
                      </div>
                    )}
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
