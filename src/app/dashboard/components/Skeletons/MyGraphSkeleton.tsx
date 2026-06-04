import { Card, CardBody, Skeleton } from "@nextui-org/react";

export const MyGraphSkeleton = () => {
  return (
    <Card className="w-full">
      <CardBody className="flex flex-col gap-4">
        <Skeleton className="h-72 w-full rounded-lg" />
        <div className="flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded" />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
