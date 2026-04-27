import PulsingButton from "@/components/PulsingButton/PulsingButton";
import {Modal, ModalContent, ModalHeader, ModalBody,Input, Spinner, Tooltip, Button, Form, Link, Popover } from "@nextui-org/react";

import { FaSearch, FaPlusCircle, FaInfoCircle } from "react-icons/fa";
import {
  Image,
} from "@nextui-org/react";
import { FormEvent, useState } from "react";
type props = {
  onOpenChange: () => void;
  isOpen: boolean | undefined;
}

export const ModalCreateFood = (props: props) => {
   const [isLoading, setIsLoading] = useState(false);




  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
debugger;

   const res = await fetch("/api/createFood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

 

    setIsLoading(false);

    if (res.ok) {
      toast
      props.onOpenChange();
    }
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
              <ModalHeader className="flex flex-col gap-1">
                ! Currently disabled
              </ModalHeader>
              <ModalBody>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                      onPress={onClose}
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
}