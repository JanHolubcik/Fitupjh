"use client";

import { Spinner, useDisclosure } from "@nextui-org/react";

import React, { useEffect, useMemo, useState } from "react";

import { useSession } from "next-auth/react";
import useLoadSavedFood from "@/hooks/useLoadSavedFood";
import { ModalFindFood } from "@/components/Findfood/components/ModalFindFood";
import NavigationYourIntake from "./components/NavigationYourIntake";

export default function Food() {
  const { data } = useSession();
  const { isFetched } = useLoadSavedFood(data?.user?.id);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showSpinner, setShowSpinner] = useState(true); // Spinner state

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-11">
      {!showSpinner && isFetched && data?.user?.id ? (
        <NavigationYourIntake onOpen={onOpen} />
      ) : showSpinner ? (
        <Spinner className=" m-2 self-center" size="lg" />
      ) : (
        <h1>Register or login!</h1>
      )}
      <ModalFindFood
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      ></ModalFindFood>
    </main>
  );
}
