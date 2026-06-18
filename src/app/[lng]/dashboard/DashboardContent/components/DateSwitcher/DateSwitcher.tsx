import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { Button, CardBody } from "@nextui-org/react";
import { add, format } from "date-fns";
import { FaArrowLeft, FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import { useT } from "next-i18next/client";
import { CardUniversal } from "@/components/common";

export const DateSwitcher = () => {
  const { currentDate, setNewDateAndGetFood } = useYourIntakeOperations();
  const { t } = useT("dashboard");

  const setNewDateAndFetchFood = (numberOfDays: number) => {
    const date = add(currentDate, {
      days: numberOfDays,
    });

    setNewDateAndGetFood(date);
  };
  const disabledButton =
    format(currentDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  return (
    <CardUniversal
      id="tour-date"
      className="sm:w-56 w-[360px] sticky top-2 z-10"
    >
      <CardBody className=" flex flex-row items-center justify-between gap-1 py-2">
        <Button
          size="sm"
          isIconOnly
          onPress={() => setNewDateAndFetchFood(-1)}
          aria-label={t("dateSwitcher.previousDay")}
          className="sm:w-7 sm:h-7 min-w-7"
        >
          <FaArrowLeft size={13} />
        </Button>
        <div className="flex items-center gap-1 text-xs font-semibold tracking-tight">
          <FaCalendarAlt className="text-default-500 flex-shrink-0" size={12} />
          <span>{format(currentDate, "dd.MM / EEE")}</span>
        </div>

        <Button
          size="sm"
          isIconOnly
          isDisabled={disabledButton}
          onPress={() => setNewDateAndFetchFood(1)}
          aria-label={t("dateSwitcher.nextDay")}
          className="sm:w-7 sm:h-7 min-w-7"
        >
          <FaArrowRight size={13} />
        </Button>
      </CardBody>
    </CardUniversal>
  );
};
