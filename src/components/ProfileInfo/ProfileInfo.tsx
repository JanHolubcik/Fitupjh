"use client";

import { Avatar, Button, Spinner, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import EditPersonCharacteristic from "../EditPersonCharacteristic/EditPersonCharacteristic";


type Value = {
  pfps: string[];
};
const goals = ["Lose weight", "Gain weight", "Stay same"];

const ProfileInfo = (props: Value) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure({
    id: "profile",
  });

  const { data } = useSession();

  const [showSpinner, setShowSpinner] = useState(true); // Spinner state

  const initialValues = {
    weight: data?.user?.weight,
    height: data?.user?.height,
    name: data?.user?.name,
    email: data?.user?.email,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [data, data?.user]);

  return (
    <div className="flex items-center flex-col min-w-60 pb-10 gap-2">
      {showSpinner ? (
        <Spinner />
      ) : (
        <>
          <Avatar
            isBordered
            color="secondary"
            src={data?.user?.image || "pfps/3.png"}
            className="transition-transform w-32 h-32 text-large m-1 self-center cursor-pointer"
            onClick={onOpen}
          />
          <p className="m-1 self-center ">{data?.user?.name}</p>
          <p className="text-center self-center">Weight {data?.user?.weight} kg</p>
          <p className="text-center self-center">Height {data?.user?.height} cm</p>
          <Button color="primary" onPress={onOpen}>
            Edit your profile
          </Button>
          <EditPersonCharacteristic
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            images={props.pfps}
            onClose={onClose}
            initialValues={initialValues}
          ></EditPersonCharacteristic>
        </>
      )}
    </div>
  );
};

export default ProfileInfo;
