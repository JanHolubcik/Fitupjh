import { Card, CardBody, Skeleton } from "@nextui-org/react";

export const DateSwitcherSkeleton = () => {
  return (
    <Card className="sm:w-56 w-80 shadow-md bg-zinc-900/80 backdrop-blur-md border border-zinc-800">
      <CardBody className="flex flex-row items-center justify-between gap-1 py-2">
        <Skeleton className="h-7 w-7 rounded-lg" />
        <Skeleton className="h-5 w-32 rounded-lg" />
        <Skeleton className="h-7 w-7 rounded-lg" />
      </CardBody>
    </Card>
  );
};
