"use client";

import { Avatar, Button, Spinner, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import EditPersonCharacteristic from "../EditPersonCharacteristic/EditPersonCharacteristic";

type Value = {
  pfps: string[];
};

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
    <div className="flex flex-col items-center w-full gap-4">
      {showSpinner ? (
        <div className="flex justify-center items-center h-48">
          <Spinner size="lg" color="primary" />
        </div>
      ) : (
        <>
          <div className="relative group">
            <Avatar
              isBordered
              color="primary"
              src={data?.user?.image || "pfps/3.png"}
              className="transition-transform w-36 h-36 text-large cursor-pointer ring-offset-2 hover:scale-105"
              onClick={onOpen}
            />
            <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-600 transition-colors shadow-sm" onClick={onOpen}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col items-center mt-2 gap-1">
            <h3 className="text-2xl font-bold tracking-tight text-foreground">{data?.user?.name}</h3>
            <p className="text-medium text-default-500">{data?.user?.email}</p>
          </div>
          
          <div className="flex w-full justify-center gap-6 my-4 bg-default-50 p-4 rounded-2xl">
            <div className="flex flex-col items-center">
              <span className="text-small text-default-500 font-medium">Weight</span>
              <span className="text-lg font-semibold text-foreground">{data?.user?.weight} <span className="text-small font-normal text-default-400">kg</span></span>
            </div>
            <div className="w-px h-10 bg-divider self-center"></div>
            <div className="flex flex-col items-center">
              <span className="text-small text-default-500 font-medium">Height</span>
              <span className="text-lg font-semibold text-foreground">{data?.user?.height} <span className="text-small font-normal text-default-400">cm</span></span>
            </div>
          </div>

          <Button 
            color="primary" 
            variant="flat"
            onPress={onOpen}
            className="w-full mt-2 font-medium"
            size="lg"
          >
            Edit Profile
          </Button>

          <EditPersonCharacteristic
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            images={props.pfps}
            onClose={onClose}
            initialValues={initialValues}
          />
        </>
      )}
    </div>
  );
};

export default ProfileInfo;
