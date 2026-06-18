import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
  Image,
} from "@nextui-org/react";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { ModalCreateFood } from "./ModalCreateFood";
import { Food, ReturnTypeFood } from "@/types/Types";
import AddFoodComponent from "./AddFoodComponent";
import { getTimeOfDay, useIsSm } from "@/app/[lng]/constants/FunctionsHelper";

import { useMutation } from "@tanstack/react-query";
import { getSearchedFoodOptions } from "@/lib/queriesOptions/GetSearchedFoodOptions";
import { useT } from "next-i18next/client";
import { ModalScanFood } from "./ModalScanFood";
import { usePathname } from "next/navigation";
import { FoodRecordModal } from "@/components/FoodRecordModal/FoodRecordModal";

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
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";
  const { t } = useT("dashboard");

  const inputRef = useRef<HTMLInputElement>(null);

  const [food, setFood] = useState<ReturnTypeFood>([]);
  const [grams, setGrams] = useState<number>(100);
  const [calculatedCalories, setCalculatedCalories] = useState<number[]>([]);

  const {
    isOpen: isOpenNew,
    onOpen: onOpenNew,
    onOpenChange: onOpenChangeNew,
  } = useDisclosure();

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<Food>();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500, setLoading);

  const searchFoodMutation = useMutation(
    getSearchedFoodOptions(debouncedSearchTerm, currentLocale),
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenBarScan,
    onOpen: onOpenBarScan,
    onClose: onCloseBarScan,
    onOpenChange: onOpenChangeBarScan,
  } = useDisclosure();

  useEffect(() => {
    const fetchFood = async () => {
      if (props.isOpen) {
        setLoading(true);
        const result = await searchFoodMutation.mutateAsync();

        setFood(result || []);
        if (result) {
          setCalculatedCalories(result.map((key) => key.calories_per_100g));
        }
        setLoading(false);
      }
    };
    fetchFood();
    return;
  }, [debouncedSearchTerm, props.isOpen]);

  useEffect(() => {
    if (props.isOpen) {
      // Small 100ms timeout ensures the modal finishes its open animation
      // before attempting to grab the focus
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [props.isOpen]);

  const sm = useIsSm();
  return (
    <>
      <Modal
        placement={"top"}
        hideCloseButton
        size="3xl"
        className="max-h-[335px]"
        scrollBehavior="inside"
        isOpen={props.isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen && isOpenNew) {
            return;
          }

          setFood([]);
          props.onOpenChange();
        }}
        motionProps={{
          variants: {
            enter: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 1 },
          },
          transition: {
            enter: { duration: 0.15 },
            exit: { duration: 0 },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-row pb-0">
                <Input
                  ref={inputRef}
                  classNames={{
                    base: "max-w-full sm:max-w-[50rem] h-10",
                    mainWrapper: "h-full",
                    input: "text-small focus:outline-none",
                    inputWrapper:
                      "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 rounded-r-none data-[focus=true]:ring-0 data-[focus=true]:ring-offset-0 data-[focus=true]:border-transparent outline-none",
                  }}
                  placeholder={t("searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClear={() => {
                    setFood([]);
                    setSearchTerm("");
                  }}
                  size="sm"
                  startContent={<FaSearch size={18} />}
                  type="search"
                />
                <div className="">
                  <Button
                    onPress={onOpenBarScan}
                    className="rounded-l-none min-w-14 bg-primary-300 dark:bg-primary-500"
                  >
                    <Image
                      className="rounded-none"
                      height={30}
                      width={30}
                      src="../barcodeIcon.svg"
                    />
                  </Button>
                </div>
              </ModalHeader>
              <ModalBody className="max-h-96 min-h-32 ">
                <div className="overflow-visible">
                  {loading ? (
                    <div className="flex flex-col items-center mt-8">
                      <Spinner />
                    </div>
                  ) : (
                    <>
                      {food?.map((key, id) => (
                        <AddFoodComponent
                          key={key.name}
                          id={id}
                          macros={key}
                          calculatedCalories={calculatedCalories}
                          setCalculatedCalories={setCalculatedCalories}
                          grams={grams}
                          setGrams={setGrams}
                          AddFood={() => {
                            onOpenNew();
                            setSelectedFood({
                              ...key,
                              id: id,
                              calories: key.calories_per_100g,
                              amount: grams.toString(),
                            });
                          }}
                          onClose={onClose}
                        />
                      ))}
                      {searchTerm.length > 0 && food?.length === 0 && (
                        <div className="flex flex-col items-center gap-2">
                          <ModalCreateFood
                            isOpen={isOpen}
                            onOpenChange={onOpenChange}
                          ></ModalCreateFood>

                          <p className="ml-5 text-sm text-center self-center">
                            {t("recordNotFound")}
                          </p>
                          <Button
                            size={"sm"}
                            color={"default"}
                            className={"text-white font-medium"}
                            variant={"faded"}
                            onPress={onOpen}
                          >
                            {t("addManually")}
                          </Button>
                        </div>
                      )}
                      <ModalScanFood
                        isOpen={isOpenBarScan}
                        onOpenChange={onOpenChangeBarScan}
                        timeOfDay={getTimeOfDay()}
                        onClose={onCloseBarScan}
                      />
                    </>
                  )}
                </div>
              </ModalBody>
              <ModalFooter className="p-2 border-t border-white/10">
                <Button
                  size="sm"
                  color="primary"
                  className="bg-red-600 text-white font-medium"
                  onPress={onClose}
                >
                  {t("close")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <FoodRecordModal
        isOpen={isOpenNew}
        onOpenChange={onOpenChangeNew}
        food={selectedFood}
        timeOfDay={props.timeOfDay ?? getTimeOfDay()}
        mode="new"
      />
    </>
  );
};
