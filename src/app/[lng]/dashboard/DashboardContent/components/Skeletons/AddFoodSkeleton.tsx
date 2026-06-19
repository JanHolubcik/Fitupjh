import { CardUniversal } from "@/components/common";
import { Skeleton } from "@heroui/react";

export const AddFoodSkeleton = () => {
  return (
    <CardUniversal className="w-full shadow-md border border-zinc-800">
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg">
            <Skeleton className="h-20 w-20 rounded-md flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-2 w-24 rounded" />
            </div>
          </div>
          <div className="flex-1 flex flex-row gap-2 justify-between">
            <Skeleton className="h-10 w-24 rounded" />
            <Skeleton className="h-10 w-24 rounded" />
            <Skeleton className="h-10 w-24 rounded" />
            <Skeleton className="h-10 w-24 rounded" />
          </div>
          <div className="flex-1 flex flex-row gap-2 justify-between border-t border-zinc-800 pt-1 pt-4">
            <div className="space-y-2 ">
              <Skeleton className="h-2 w-16 rounded" />
              <Skeleton className="h-10 w-24 rounded" />
            </div>
            <div className="space-y-2 ">
              <Skeleton className="h-2 w-16 rounded" />
              <Skeleton className="h-10 w-24 rounded" />
            </div>

            <Skeleton className="h-8 w-8 self-center mt-4 rounded-full" />
          </div>
        </div>
      </div>
    </CardUniversal>
  );
};
