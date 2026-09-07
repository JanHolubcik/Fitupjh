import { CardUniversal } from "@/components/common";
import { CardBody, Skeleton } from "@heroui/react";

export const WaterTrackerSkeleton = () => {
  return (
    <CardUniversal className="w-full sm:max-w-2xl self-center border-sky-500/20 shadow-lg">
      <CardBody className="p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <div className="flex flex-col gap-1">
              <Skeleton className="w-24 h-4 rounded" />
              <Skeleton className="w-36 h-3 rounded" />
            </div>
          </div>
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>

        <div className="p-3.5 rounded-2xl border border-default-200/50 dark:border-white/5 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Skeleton className="w-28 h-6 rounded" />
            <Skeleton className="w-24 h-4 rounded" />
          </div>
          <Skeleton className="w-full h-2.5 rounded-full" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="flex-1 h-9 rounded-xl" />
          <Skeleton className="w-20 h-9 rounded-xl" />
        </div>
      </CardBody>
    </CardUniversal>
  );
};
