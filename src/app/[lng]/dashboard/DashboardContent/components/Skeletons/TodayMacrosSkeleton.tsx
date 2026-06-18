import { CardUniversal } from "@/components/common";
import { CardBody, Skeleton } from "@nextui-org/react";

export const TodayMacrosSkeleton = () => {
  return (
    <CardUniversal className="w-full sm:flex-1 shadow-md bg-zinc-900/80 backdrop-blur-md border border-zinc-800">
      <CardBody className="flex flex-col gap-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg bg-content2"
          >
            <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-2 w-16 rounded" />
            </div>
          </div>
        ))}
      </CardBody>
    </CardUniversal>
  );
};
