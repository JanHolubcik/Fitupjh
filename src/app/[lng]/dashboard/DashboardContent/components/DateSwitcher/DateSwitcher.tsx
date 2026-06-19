import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { Button, CardBody } from "@heroui/react";
import { add, format } from "date-fns";
import { FaArrowLeft, FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import { useT } from "next-i18next/client";
import { CardUniversal } from "@/components/common";

const DateSwitcher = () => {
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
      className="w-full sm:w-64 sm:stat  sticky top-2 sm:z-0 z-50 border-primary/30 dark:border-primary/20 shadow-xl"
    >
      <CardBody className="flex flex-row items-center justify-between gap-1 py-2">
        <Button
          size="sm"
          isIconOnly
          variant="flat"
          color="primary"
          onPress={() => setNewDateAndFetchFood(-1)}
          aria-label={t("dateSwitcher.previousDay")}
          className="w-8 h-8 min-w-8 sm:w-7 sm:h-7 sm:min-w-7 rounded-lg"
        >
          <FaArrowLeft size={13} />
        </Button>
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold tracking-wider bg-primary-50 dark:bg-primary/10 text-primary px-3 py-1 rounded-full">
          <FaCalendarAlt className="flex-shrink-0" size={12} />
          <span>{format(currentDate, "dd.MM / EEE")}</span>
        </div>

        <Button
          size="sm"
          isIconOnly
          variant="flat"
          color="primary"
          isDisabled={disabledButton}
          onPress={() => setNewDateAndFetchFood(1)}
          aria-label={t("dateSwitcher.nextDay")}
          className="w-8 h-8 min-w-8 sm:w-7 sm:h-7 sm:min-w-7 rounded-lg"
        >
          <FaArrowRight size={13} />
        </Button>
      </CardBody>
    </CardUniversal>
  );
};

export default DateSwitcher;
