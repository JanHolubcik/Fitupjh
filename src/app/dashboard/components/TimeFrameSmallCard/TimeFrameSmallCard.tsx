import { Button, Card, Image } from "@nextui-org/react";

import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
type props = {
  timeFrame: "breakfast" | "dinner" | "lunch";
};

export const TimeFrameSmallCard = (props: props) => {
  const { timeFrame } = props;
  return (
    <Card className="flex flex-row justify-between items-center text-left">
      <Image
        className=" pl-2"
        alt="Info"
        src="cloche.svg"
        width={30}
        height={50}
      />
      <p>{timeFrame}</p>
      <Button variant="light" className="m-0 p-0" size="sm" onPress={() => {}}>
        <ArrowRightCircleIcon fontSize={5}></ArrowRightCircleIcon>
      </Button>
    </Card>
  );
};
