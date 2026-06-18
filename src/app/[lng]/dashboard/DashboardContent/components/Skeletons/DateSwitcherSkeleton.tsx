import { CardUniversal } from "@/components/common";
import { CardBody, Skeleton } from "@nextui-org/react";

export const DateSwitcherSkeleton = () => {
  return (
    <CardUniversal className="w-full sm:max-w-2xl shadow-md bg-zinc-900/80 backdrop-blur-md border border-zinc-800">
      <CardBody className="flex flex-row items-center justify-between gap-1 py-2">
        <Skeleton className="h-7 w-7 rounded-lg" />
        <Skeleton className="h-5 w-32 rounded-lg" />
        <Skeleton className="h-7 w-7 rounded-lg" />
      </CardBody>
    </CardUniversal>
  );
};
