import { Button, useDisclosure } from "@nextui-org/react";

import { ModalFindFood } from "@/components/Findfood/components/ModalFindFood";
import { ModalCreateFood } from "@/components/Findfood/components/ModalCreateFood";

import { Food } from "@/types/Types";
import { FaPlusCircle, FaTimes } from "react-icons/fa";
import ImageFromURL from "@/components/ImageFromURL/ImageFromURL";
import { useState } from "react";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { EditFoodModal } from "@/components/EditFoodModal/EditFoodModal";
import {
  getMacroInfo,
  type MacroType,
} from "@/app/[lng]/constants/MacrosHelper";
import { useT } from "next-i18next/client";
import {
  capitalizeFirstLetter,
  getTimeOfDay,
} from "@/app/[lng]/constants/FunctionsHelper";
import { ModalScanFood } from "@/components/Findfood/components/ModalScanFood";

type props = {
  timeFrame: "breakfast" | "dinner" | "lunch";
  foodItems: Food[];
};

export const TimeFrameSmallCard = (props: props) => {
  const { foodItems } = props;
  const { removeFromSavedFood } = useYourIntakeOperations();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { t } = useT("dashboard");
  const {
    isOpen: isOpenNewFood,
    onOpen: onOpenNewFood,
    onOpenChange: onOpenChangeNewFood,
  } = useDisclosure();
  const {
    isOpen: QRisOpen,
    onOpenChange: QRonOpenChange,
    onClose: QRonClose,
  } = useDisclosure();
  const closeAllModals = () => {
    QRonClose();
    onClose();
    QRonClose();
  };
  const { onOpenChange: onEditOpenChange, isOpen: isEditOpen } =
    useDisclosure();

  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  return (
    <div className="flex flex-col p-2 bg-zinc-300 dark:bg-zinc-950 rounded-xl">
      <div className="flex flex-col rounded-xl">
        {foodItems.map((key) => (
          <div
            onClick={() => {
              setSelectedFood(key);
              onEditOpenChange();
            }}
            className="flex flex-row items-center first:rounded-t-xl last:rounded-b-xl justify-between gap-3 p-2 bg-zinc-200 dark:bg-zinc-900 border border-white/[0.02] hover:bg-white/[0.03] hover:border-white/5  transition-all duration-200 group hover:cursor-pointer"
            key={key.id}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="aspect-square flex flex-col items-center justify-center bg-zinc-500 dark:bg-zinc-950/40 p-1 rounded-xl border border-white/5 shadow-inner group-hover:scale-102 transition-transform">
                <ImageFromURL
                  width={35}
                  height={35}
                  macroName={key.name}
                  url={key.imgUrl}
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className="font-bold text-xs sm:text-sm dark:text-zinc-200 capitalize whitespace-nowrap overflow-hidden text-ellipsis w-16 sm:w-36">
                  {key.name}
                </p>
                <div className="sm:grid  grid-cols-5 gap-1 self-start hidden ">
                  {[
                    { macro: "protein" as MacroType, value: key.protein },
                    {
                      macro: "carbohydrates" as MacroType,
                      value: key.carbohydrates,
                    },
                    { macro: "fat" as MacroType, value: key.fat },
                    { macro: "sugar" as MacroType, value: key.sugar },
                    { macro: "fiber" as MacroType, value: key.fiber },
                  ].map((item) => {
                    const macroInfo = getMacroInfo(item.macro, item.value);
                    const translatedLabel = t(`macros.${item.macro}`, {
                      defaultValue: capitalizeFirstLetter(item.macro),
                    });
                    const shortLabel = translatedLabel.charAt(0).toUpperCase();

                    return (
                      <div
                        className="w-12 text-center text-[8px] "
                        key={item.macro}
                      >
                        <span
                          className={`${macroInfo.text} ${macroInfo.bg} border-1 ${macroInfo.border} px-[1px]  rounded-sm inline-block w-full`}
                        >
                          {shortLabel}:{" "}
                          <span
                            className={`${macroInfo.text}  ${macroInfo.border} font-medium `}
                          >
                            {item.value.toFixed(1) || 0}g
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0 pl-1 py-0.5 ">
              <div className="flex flex-col">
                <span className="text-zinc-500 font-bold self-end text-[9px] sm:text-[10px] pr-1">
                  {key.amount}g
                </span>
                <span className="w-[75px] text-right bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded-md font-extrabold text-[10px] sm:text-[11px] tracking-wide border border-primary-500/10 shadow-sm">
                  {key.calories.toFixed(0)} kcal
                </span>
              </div>
              <Button
                size="sm"
                onPress={() => removeFromSavedFood(key.id, props.timeFrame)}
                isIconOnly
                radius="lg"
                variant="light"
                className="w-8 h-8 min-w-8 text-zinc-500 hover:text-danger hover:bg-danger/10 group-hover:text-zinc-400 transition-all duration-150"
              >
                <FaTimes size={12} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <EditFoodModal
        isOpen={isEditOpen}
        onOpenChange={onEditOpenChange}
        food={selectedFood}
        timeOfDay={props.timeFrame}
      />
      <ModalFindFood
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        timeOfDay={props.timeFrame}
      />
      <ModalScanFood
        isOpen={QRisOpen}
        onOpenChange={QRonOpenChange}
        timeOfDay={props.timeFrame && getTimeOfDay()}
      />
      <ModalCreateFood
        isOpen={isOpenNewFood}
        onOpenChange={onOpenChangeNewFood}
        onCloseAll={closeAllModals}
      />
      <Button
        onPress={onOpen}
        isIconOnly
        variant="flat"
        className="w-8 h-8 min-w-8 self-center my-2 text-primary-300 light:bg-slate-300"
      >
        <FaPlusCircle size={16} />
      </Button>
    </div>
  );
};
