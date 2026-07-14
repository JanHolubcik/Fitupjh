import { CardProps, Card } from "@heroui/react";
import { ReactNode } from "react";

type CardUniversalProps = {
  children: ReactNode;
} & CardProps;

const CardUniversal = ({
  children,
  className,
  ...props
}: CardUniversalProps) => {
  return (
    <Card
      className={
        className +
        " bg-neutral-100 dark:bg-content1 shadow-xl dark:shadow-lg border-2 dark:border-gray-800"
      }
      {...props}
    >
      {children}
    </Card>
  );
};

export default CardUniversal;
