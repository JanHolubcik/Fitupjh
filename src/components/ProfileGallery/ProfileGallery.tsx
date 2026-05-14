"use client";

import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Avatar, Button, Modal, ModalBody, ModalContent } from "@nextui-org/react";

interface ProfileGalleryProps {
  images: string[];
  onConfirm: (par: string | null) => void;
  onSelect?: (img: string) => void;
  onOpenChange: () => void;
  isOpen: boolean | undefined;
}

export default function ProfileGallery({
  images,
  onConfirm,
  onSelect,
  isOpen,
  onOpenChange,
}: ProfileGalleryProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (img: string) => {
    setSelected(img);
    onSelect?.(img);
  };

  return (
    <Modal
      placement="top-center"
      hideCloseButton
      size="2xl"
      isOpen={isOpen}
      isDismissable={false} 
      onOpenChange={() => {
        onOpenChange();
      }}
    >
      {/* Avatar Gallery */}
      <ModalContent >
        {() => (
          <>
            <ModalBody className="font-bold text-lar flex items-center pt-4 gap-10 mb-3">
              <h2 className="">Select your profile picture</h2>
              <div  className="flex flex-row justify-center gap-8 items-center">
              {images.map((img) => (
                <Avatar
                  key={img}
                  src={img}
                   isBordered       
                  alt={`Profile ${img}`}
                  color={selected===img? "primary":"default"}
                  
                  onClick={() =>handleSelect(img)}
                  className="w-24 h-24 rounded-full cursor-pointer"
                />
              ))}
           </div>

            {/* Confirm Button */}
            <Button
              color="primary"
              
              onPress={(e) => {
                onConfirm(selected);
              }}
              isDisabled={!selected} 
            >
              Confirm Selection
            </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
