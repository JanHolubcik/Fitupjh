"use client";
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import { FaPlusCircle, FaTimes } from "react-icons/fa";
import { useDisclosure } from "@nextui-org/react";
import { ModalFindFood } from "../Findfood/components/ModalFindFood";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import ImageFromURL from "../ImageFromURL/ImageFromURL";

type Food = {
  timeOfDay: "breakfast" | "lunch" | "dinner";
};

const FindFood = (props: Food) => {
  const { savedFood, removeFromSavedFood } = useYourIntakeOperations();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Card className="w-full max-w-[500px] mt-5 bg-zinc-900/30 border border-white/5 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-zinc-900/90 to-zinc-900/40 px-4 py-3.5 border-b border-white/5">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-sm sm:text-base font-extrabold text-zinc-100 capitalize tracking-wider">
            {props.timeOfDay}
          </h1>
          <span className="text-[10px] text-zinc-500 font-medium">
            {savedFood[props.timeOfDay].length}{" "}
            {savedFood[props.timeOfDay].length === 1 ? "item" : "items"} logged
          </span>
        </div>

        <Button
          onPress={onOpen}
          isIconOnly
          radius="full"
          variant="flat"
          className="w-8 h-8 min-w-8 bg-white/[0.03] border border-white/5 text-[#00FFAA] hover:bg-[#00FFAA]/10 hover:border-[#00FFAA]/20 hover:scale-105 transition-all duration-200"
        >
          <FaPlusCircle size={16} />
        </Button>
      </CardHeader>

      <CardBody className="flex flex-col gap-1.5 p-2 sm:p-3 bg-zinc-950/10">
        {savedFood[props.timeOfDay].length !== 0 ? (
          <div className="flex flex-col gap-1">
            {savedFood[props.timeOfDay].map((key) => (
              <div
                className="flex flex-row items-center justify-between gap-3 p-2 bg-zinc-900/20 border border-white/[0.02] hover:bg-white/[0.03] hover:border-white/5 rounded-xl transition-all duration-200 group"
                key={key.id}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 bg-zinc-950/40 p-1 rounded-xl border border-white/5 shadow-inner group-hover:scale-102 transition-transform">
                    <ImageFromURL macroName={key.name} url={key.imgUrl} />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="font-bold text-xs sm:text-sm text-zinc-200 capitalize leading-tight truncate pr-2 group-hover:text-white transition-colors">
                      {key.name}
                    </p>

                    <div className="flex flex-row items-center gap-2 text-[10px] sm:text-[11px] font-semibold mt-1.5 text-zinc-400">
                      <span className="text-success-400">
                        P:{" "}
                        <span className="text-zinc-300 font-medium">
                          {key.protein || 0}g
                        </span>
                      </span>
                      <span className="text-zinc-800 font-normal">|</span>
                      <span className="text-warning-400">
                        C:{" "}
                        <span className="text-zinc-300 font-medium">
                          {key.carbohydrates || 0}g
                        </span>
                      </span>
                      <span className="text-zinc-800 font-normal">|</span>
                      <span className="text-pink-400">
                        F:{" "}
                        <span className="text-zinc-300 font-medium">
                          {key.fat || 0}g
                        </span>
                      </span>
                      {key.sugar ? (
                        <>
                          <span className="text-zinc-800 font-normal">|</span>
                          <span className="text-purple-400">
                            S:{" "}
                            <span className="text-zinc-300 font-medium">
                              {key.sugar}g
                            </span>
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0 pl-1">
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded-md font-extrabold text-[10px] sm:text-[11px] tracking-wide border border-primary-500/10 shadow-sm">
                      {key.calories} kcal
                    </span>
                    <span className="text-zinc-500 font-bold text-[9px] sm:text-[10px] pr-1">
                      {key.amount}g
                    </span>
                  </div>

                  <Button
                    size="sm"
                    onPress={() => removeFromSavedFood(key.id, props.timeOfDay)}
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
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-white/5 rounded-xl bg-zinc-900/10">
            <p className="text-xs font-medium text-zinc-500 max-w-[240px] leading-normal">
              No food logged for this meal segment
            </p>
          </div>
        )}

        <ModalFindFood
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          timeOfDay={props.timeOfDay}
        />
      </CardBody>
    </Card>
  );
};

export default FindFood;
