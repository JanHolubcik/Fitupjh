import { CardUniversal } from "@/components/common";
import { CardBody, Skeleton } from "@nextui-org/react";

export const MyGraphSkeleton = () => {
  return (
    <CardUniversal className="w-full shadow-md bg-zinc-900/80 backdrop-blur-md border border-zinc-800">
      <CardBody className="flex flex-col gap-4">
        <Skeleton className="h-72 w-full rounded-lg" />
        <div className="flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded" />
          ))}
        </div>
      </CardBody>
    </CardUniversal>
  );
};
