import { Button, useDisclosure } from "@nextui-org/react";

import { ModalFindFood } from "@/components/Findfood/components/ModalFindFood";
import { ModalCreateFood } from "@/components/Findfood/components/ModalCreateFood";
import { ModalBarcodeScan } from "@/components/Findfood/components/ModalBarcodeScan";
import { Food } from "@/types/Types";
import { FaPlusCircle, FaTimes } from "react-icons/fa";
import ImageFromURL from "@/components/ImageFromURL/ImageFromURL";
import { useState } from "react";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { EditFoodModal } from "@/components/EditFoodModal/EditFoodModal";

type props = {
  timeFrame: "breakfast" | "dinner" | "lunch";
  foodItems: Food[];
};

export const TimeFrameSmallCard = (props: props) => {
  const { timeFrame, foodItems } = props;
  const { removeFromSavedFood } = useYourIntakeOperations();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isOpenNewFood,
    onOpen: onOpenNewFood,
    onOpenChange: onOpenChangeNewFood,
  } = useDisclosure();
  const {
    isOpen: QRisOpen,
    onOpen: QRonOpen,
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
    <div className="flex flex-col p-2 bg-zinc-950 rounded-xl">
      <div className="flex flex-col rounded-xl">
        {foodItems.map((key) => (
          <div
            onClick={() => {
              setSelectedFood(key);
              onEditOpenChange();
            }}
            className="flex flex-row items-center first:rounded-t-xl last:rounded-b-xl justify-between gap-3 p-2 bg-zinc-900 border border-white/[0.02] hover:bg-white/[0.03] hover:border-white/5  transition-all duration-200 group hover:cursor-pointer"
            key={key.id}
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

            <div className="flex items-center gap-2.5 flex-shrink-0 pl-1">
              <span className="w-[40px] text-center text-[10px] font-semibold text-success-400">
                P:{" "}
                <span className="text-zinc-300 font-medium">
                  {key.protein || 0}g
                </span>
              </span>
              <span className="text-zinc-800 font-normal text-[10px]">|</span>
              <span className="w-[40px] text-center text-[10px] font-semibold text-warning-400">
                C:{" "}
                <span className="text-zinc-300 font-medium">
                  {key.carbohydrates || 0}g
                </span>
              </span>
              <span className="text-zinc-800 font-normal text-[10px]">|</span>
              <span className="w-[45px] text-center text-[10px] font-semibold text-pink-400">
                F:{" "}
                <span className="text-zinc-300 font-medium">
                  {key.fat || 0}g
                </span>
              </span>

              {key.sugar ? (
                <>
                  <span className="text-zinc-800 font-normal text-[10px]">
                    |
                  </span>
                  <span className="w-[45px] text-center text-[10px] font-semibold text-purple-400">
                    S:{" "}
                    <span className="text-zinc-300 font-medium">
                      {key.sugar}g
                    </span>
                  </span>
                </>
              ) : null}
              <div className="flex flex-col">
                <span className="text-zinc-500 font-bold self-end text-[9px] sm:text-[10px] pr-1">
                  {key.amount}g
                </span>
                <span className="bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded-md font-extrabold text-[10px] sm:text-[11px] tracking-wide border border-primary-500/10 shadow-sm">
                  {key.calories} kcal
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
      <ModalBarcodeScan
        isOpen={QRisOpen}
        onOpenChange={QRonOpenChange}
        onClose={QRonClose}
        onOpenNewFood={onOpenNewFood}
        onCloseAll={closeAllModals}
        timeOfDay={props.timeFrame}
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
        className="w-8 h-8 min-w-8 self-center my-2 bg-white/[0.03] border border-white/5 text-[#00FFAA] hover:bg-[#00FFAA]/10 hover:border-[#00FFAA]/20  transition-all duration-200"
      >
        <FaPlusCircle size={16} />
      </Button>
    </div>
  );
};
