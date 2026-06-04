import { Card, CardBody, Skeleton } from "@nextui-org/react";

export const CalorieCardSkeleton = () => {
  return (
    <Card className="w-full">
      <CardBody className="flex flex-col items-center justify-center gap-4 p-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-3 w-40 rounded" />
      </CardBody>
    </Card>
  );
};
