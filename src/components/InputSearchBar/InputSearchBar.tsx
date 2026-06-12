"use client";
import { FaSearch } from "react-icons/fa";
import {
  Button,
  Input,
  Spinner,
  useDisclosure,
  Image,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { Food, ReturnTypeFood } from "@/types/Types";
import React from "react";
import {
  getTimeOfDay,
  useDebounce,
} from "@/app/[lng]/constants/FunctionsHelper";
import { useMutation } from "@tanstack/react-query";
import { getSearchedFoodOptions } from "@/lib/queriesOptions/GetSearchedFoodOptions";

import ImageFromURL from "../ImageFromURL/ImageFromURL";
import { NewFoodRecordModal } from "../NewFoodRecordModal/NewFoodRecordModal";
import { ModalBarcodeScan } from "../Findfood/components/ModalBarcodeScan";
import { ModalCreateFood } from "../Findfood/components/ModalCreateFood";
import { useT } from "next-i18next/client";

export const InputSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useT("dashboard");

  const [food, setFood] = useState<ReturnTypeFood>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500, setLoading);
  const [selectedFood, setSelectedFood] = useState<Food>();
  const searchFoodMutation = useMutation(
    getSearchedFoodOptions(debouncedSearchTerm),
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.length === 0) {
      setFood([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }
    const fetchFood = async () => {
      setLoading(true);
      try {
        const result = await searchFoodMutation.mutateAsync();

        if (result) {
          setFood(result);
          setIsOpen(true);
        } else {
          setFood([]);
          setIsOpen(false);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [debouncedSearchTerm]);

  const { isOpen: isOpenNew, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: QRisOpen,
    onOpen: QRonOpen,
    onOpenChange: QRonOpenChange,
    onClose: QRonClose,
  } = useDisclosure();
  const {
    isOpen: isOpenNewFood,
    onOpen: onOpenNewFood,
    onOpenChange: onOpenChangeNewFood,
  } = useDisclosure();

  const closeAllModals = () => {
    QRonClose();
    onClose();
    QRonClose();
  };

  return (
    <div
      ref={containerRef}
      className="relative  flex items-center w-full max-w-full min-w-60 sm:min-w-56 sm:w-full border-1 rounded-xl  "
    >
      <div className="flex-1  ">
        <Input
          classNames={{
            base: "h-8 w-full ",
            mainWrapper: "h-full ",
            input: "text-small ",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 rounded-r-none",
          }}
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => {
            setFood([]);
            setSearchTerm("");
            setIsOpen(false);
          }}
          onFocus={() => food && food.length > 0 && setIsOpen(true)}
          size="sm"
          startContent={
            loading ? (
              <Spinner size="sm" color="default" />
            ) : (
              <FaSearch size={18} />
            )
          }
          type="search"
        />
      </div>

      <Button
        onPress={() => QRonOpen()}
        color="primary"
        className="rounded-l-none min-w-10 h-8 self-center"
      >
        <Image
          className="rounded-none"
          height={20}
          width={20}
          src="../barcodeIcon.svg"
          alt="Barcode scan"
        />
      </Button>

      <ul
        className="
    absolute top-[calc(100%+4px)] left-0 z-50
    sm:w-72 w-56  
    bg-white dark:bg-zinc-900 rounded-xl shadow-xl
  "
      >
        {food &&
          isOpen &&
          food.map((key, index) => (
            <li
              key={key.name}
              onClick={() => {
                setSelectedFood({
                  ...key,
                  id: index,
                  calories: key.calories_per_100g,
                  amount: key.ProductWeight
                    ? key.ProductWeight.toString()
                    : "100g",
                });
                onOpen();
                setIsOpen(false);
              }}
              className="flex flex-row items-center shadow-md first:rounded-t-xl last:rounded-b-xl justify-between gap-3 p-2 bg-zinc-900 border border-white/[0.02] hover:bg-white/[0.03] hover:border-white/5  transition-all duration-200 group hover:cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="aspect-square flex items-center justify-center bg-zinc-950/40 p-1 rounded-xl border border-white/5 shadow-inner group-hover:scale-102 transition-transform">
                  <ImageFromURL
                    width={35}
                    height={35}
                    macroName={key.name}
                    url={key.imgUrl}
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="font-bold text-xs sm:text-sm text-zinc-200 capitalize ">
                    {key.name}
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-zinc-500 font-bold self-end text-[9px] sm:text-[10px] pr-1">
                  {key.ProductWeight
                    ? key.ProductWeight.toString() + "g"
                    : "100g"}
                </span>
                <span className="bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded-md font-extrabold text-[10px] sm:text-[11px] tracking-wide border border-primary-500/10 shadow-sm">
                  {key.ProductWeight
                    ? (key.calories_per_100g / 100) * Number(key.ProductWeight)
                    : key.calories_per_100g}{" "}
                  kcal
                </span>
              </div>
            </li>
          ))}
        {debouncedSearchTerm.length > 0 && food?.length === 0 && (
          <div className="flex flex-col items-center gap-2 p-4">
            <p className="ml-5 text-sm text-center self-center">
              {t("recordNotFound")}
            </p>
            <Button
              size={"sm"}
              color={"default"}
              className={"text-white font-medium"}
              variant={"faded"}
              onPress={onOpenNewFood}
            >
              {t("addManually")}
            </Button>
          </div>
        )}
      </ul>
      <NewFoodRecordModal
        isOpen={isOpenNew}
        onOpenChange={onOpenChange}
        food={selectedFood}
        timeOfDay={getTimeOfDay()}
      />
      <ModalBarcodeScan
        isOpen={QRisOpen}
        onOpenChange={QRonOpenChange}
        onClose={QRonClose}
        onOpenNewFood={onOpenNewFood}
        onCloseAll={closeAllModals}
        timeOfDay={getTimeOfDay()}
      />
      <ModalCreateFood
        isOpen={isOpenNewFood}
        onOpenChange={onOpenChangeNewFood}
        onCloseAll={closeAllModals}
      />
    </div>
  );
};
