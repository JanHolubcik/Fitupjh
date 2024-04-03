"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";
import { useState } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { PiArrowSquareDownRightLight } from "react-icons/pi";
import { TbLayoutBottombarExpand, TbLayoutNavbarExpand } from "react-icons/tb";

type Food = {
  name: string;
  description: string;
  image?: File;
};

const NavbarComponent = (props: Food) => {
  const [isExpanded, setIsExpanded] = useState<Boolean>(false);

  return (
    <Card
      isPressable={true}
      isHoverable={true}
      onPress={() => setIsExpanded(!isExpanded)}
      className="max-w-[400px] p-2 mt-5"
    >
      <CardHeader>
        <h1>{props.name}</h1>
      </CardHeader>
      <div className="flex ...">
        <div className="m-1 flex-none w-150 ...">
          <Image
            alt="nextui logo"
            height={100}
            radius="sm"
            src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
            width={100}
          />
        </div>
        <div
          className={isExpanded ? "flex-column m-1" : "flex-column h-14 m-1"}
        >
          <p className={isExpanded ? "" : "line-clamp-3"}>
            {props.description}
          </p>
        </div>
      </div>
      <CardFooter className="flex-col items-end">
        {isExpanded ? <MdExpandLess size={35} /> : <MdExpandMore size={35} />}
      </CardFooter>
    </Card>
  );
};

export default NavbarComponent;
