import { CardUniversal } from "@/components/common";
import { Card, CardBody, Skeleton } from "@nextui-org/react";

export const CalorieCardSkeleton = () => {
  return (
    <CardUniversal className="w-full shadow-md bg-zinc-900/80 backdrop-blur-md border border-zinc-800">
      <CardBody className="flex flex-col items-center justify-center gap-4 p-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-3 w-40 rounded" />
      </CardBody>
    </CardUniversal>
  );
};
