import React, { ReactNode } from "react";
import { Button } from "@heroui/react";
import { useT } from "next-i18next/client";
import CardUniversal from "./CardUniversal";

type CardErrorProps = {
  title: string;
  description: string;
  icon: ReactNode;
  refetch: () => void | Promise<void>;
  className?: string;
};

const CardError = ({
  title,
  description,
  icon,
  refetch,
  className = "",
}: CardErrorProps) => {
  const { t } = useT("dashboard");

  return (
    <CardUniversal
      className={`w-full bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-500/20 p-5 flex flex-col gap-4 text-center items-center justify-center ${className}`}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="text-red-500 dark:text-red-400 text-3xl">
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-red-700 dark:text-red-400">
            {title}
          </h2>
          <p className="text-xs font-normal text-red-600/80 dark:text-red-400/70 max-w-sm">
            {description}
          </p>
        </div>
      </div>
      <Button
        size="sm"
        color="danger"
        variant="flat"
        onPress={refetch}
        className="font-bold text-xs px-4 h-8 rounded-lg mt-1 bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-red-700 dark:text-red-300"
      >
        {t("error.tryAgain")}
      </Button>
    </CardUniversal>
  );
};

export default CardError;
