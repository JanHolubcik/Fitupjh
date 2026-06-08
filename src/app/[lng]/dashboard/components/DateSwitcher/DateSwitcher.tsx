import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { Button, Card, CardBody } from "@nextui-org/react";
import { add, format } from "date-fns";
import { FaArrowLeft, FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import { useT } from "next-i18next/client";

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
    <Card className="sm:w-56 w-80 ">
      <CardBody className=" flex flex-row items-center justify-between gap-1 py-2">
        <Button
          size="sm"
          isIconOnly
          onPress={() => setNewDateAndFetchFood(-1)}
          aria-label={t("dateSwitcher.previousDay")}
          className="w-7 h-7 min-w-7"
        >
          <FaArrowLeft size={10} />
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
          className="w-7 h-7 min-w-7"
        >
          <FaArrowRight size={10} />
        </Button>
      </CardBody>
    </Card>
  );
};

