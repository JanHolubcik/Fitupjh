import { CardUniversal } from "@/components/common";
import { Skeleton } from "@nextui-org/react";

export const AccordionTimeFrameSkeleton = () => {
  return (
    <CardUniversal className="w-full shadow-md bg-zinc-900/80 backdrop-blur-md border border-zinc-800">
      <div className="flex flex-col gap-2 p-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-content2">
              <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-2 w-32 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardUniversal>
  );
};
