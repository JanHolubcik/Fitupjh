import { getTimeOfDay } from "@/app/constants/FunctionsHelper";
import { setNewFoodBarCode } from "@/features/savedFoodslice/yourIntakeSlice";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { RootState } from "@/store/store";
import { Food } from "@/types/Types";
import {
  Modal,
  ModalContent,
  ModalBody,
  Input,
  Button,
} from "@nextui-org/react";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
type props = {
  onOpenChange: () => void;
  isOpen: boolean | undefined;
  onCloseAll?: () => void;
};

export const ModalCreateFood = (props: props) => {
  const { addToFoodObject } = useYourIntakeOperations();
  const dispatch = useDispatch();
  const newFoodBarCode = useSelector(
    (state: RootState) => state.savedFood.newFoodBarCode,
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const parsedFoodData: Food = {
      id: Date.now(),
      name: formData.get("name") as string,
      calories: Number(formData.get("calories_per_100g")),
      amount: "100g",
      protein: Number(formData.get("protein")),
      sugar: Number(formData.get("sugar")),
      fiber: Number(formData.get("fiber")),
      fat: Number(formData.get("fat")),
      carbohydrates: Number(formData.get("carbohydrates")),
      salt: Number(formData.get("salt")),
    };
    const res = fetch("/api/createFood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    }).finally(() => {
      dispatch(setNewFoodBarCode(""));
      addToFoodObject(parsedFoodData, getTimeOfDay());
    });

    toast.promise(
      res,
      {
        pending: "Sending request...",
        success: "New food was saved successfully!",
        error: "There was an error while trying to save new food.",
      },
      {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      },
    );
    props.onOpenChange();
    props.onCloseAll && props.onCloseAll();
  };

  return (
    <Modal
      placement="top"
      hideCloseButton
      size="lg"
      isOpen={props.isOpen}
      onOpenChange={() => {
        props.onOpenChange();
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                  <p className="m-1 ml-2">Barcode</p>
                  <Input
                    name="barcode"
                    classNames={{
                      inputWrapper:
                        "transition-all duration-200 ring-1 ring-transparent focus-within:ring-[#00FFAA] focus-within:ring-2 shadow-md focus-within:shadow-[#00FFAA]/50",
                      input: "text-white",
                      label: "text-white",
                    }}
                    type="text"
                    placeholder="Barcode number"
                    value={newFoodBarCode}
                  />
                </div>
                <div>
                  <p className="m-1 ml-2">Food name</p>
                  <Input
                    name="name"
                    classNames={{
                      inputWrapper:
                        "transition-all duration-200 ring-1 ring-transparent focus-within:ring-[#00FFAA] focus-within:ring-2 shadow-md focus-within:shadow-[#00FFAA]/50",
                      input: "text-white",
                      label: "text-white",
                    }}
                    type="text"
                    placeholder="Enter food name"
                    required
                  />
                </div>
                <div>
                  <p className="m-1 ml-2">Calories per 100g</p>
                  <Input
                    name="calories_per_100g"
                    classNames={{
                      inputWrapper:
                        "transition-all duration-200 ring-1 ring-transparent focus-within:ring-[#00FFAA] focus-within:ring-2 shadow-md focus-within:shadow-[#00FFAA]/50",
                      input: "text-white",
                      label: "text-white",
                    }}
                    type="number"
                    placeholder="Enter number of calories per 100g"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="m-1 ml-2">Protein in g</p>
                    <Input
                      name="protein"
                      type="number"
                      placeholder="Protein"
                      required
                    />
                  </div>
                  <div>
                    <p className="m-1 ml-2">Sugar in g</p>
                    <Input
                      name="sugar"
                      type="number"
                      placeholder="Sugar"
                      required
                    />
                  </div>
                  <div>
                    <p className="m-1 ml-2">Fiber in g</p>
                    <Input
                      name="fiber"
                      type="number"
                      placeholder="Fiber"
                      required
                    />
                  </div>
                  <div>
                    <p className="m-1 ml-2">Fat in g</p>
                    <Input
                      name="fat"
                      type="number"
                      placeholder="Fat"
                      required
                    />
                  </div>
                  <div>
                    <p className="m-1 ml-2">Carbohydrates in g</p>
                    <Input
                      name="carbohydrates"
                      type="number"
                      placeholder="Carbs"
                      required
                    />
                  </div>
                  <div>
                    <p className="m-1 ml-2">Salt in g</p>
                    <Input
                      name="salt"
                      type="number"
                      placeholder="Salt"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    color="success"
                    className="font-bold flex-1"
                    type="submit"
                  >
                    Submit
                  </Button>
                  <Button
                    onPress={() => {
                      props.onCloseAll && props.onCloseAll();
                      onClose();
                    }}
                    color="danger"
                    className="font-bold flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
