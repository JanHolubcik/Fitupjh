"use client";

import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Avatar, Button } from "@nextui-org/react";

interface ProfileGalleryProps {
  images: string[];
  onConfirm: (par: string | null) => void;
  onSelect?: (img: string) => void;
}

export default function ProfileGallery({
  images,
  onConfirm,
  onSelect,
}: ProfileGalleryProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (img: string) => {
    setSelected(img);
    onSelect?.(img);
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      {/* Avatar Gallery */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => handleSelect(img)}
            className={`relative p-1 cursor-pointer transition duration-200 rounded-full 
          flex justify-center items-center 
          ${
            selected === img
              ? "border-4 border-blue-500 shadow-lg"
              : "border-2 border-gray-200"
          }
        `}
          >
            <Avatar
              src={img}
              alt={`Profile ${idx}`}
              className="w-24 h-24 rounded-full"
            />
            {selected === img && (
              <CheckCircleIcon className="absolute top-1 right-1 w-6 h-6 text-blue-500" />
            )}
          </div>
        ))}
      </div>

      {/* Confirm Button */}
      <Button
        color="primary"
        onPress={() => {
          onConfirm(selected);
        }}
        isDisabled={!selected} // Disable if nothing selected
      >
        Confirm Selection
      </Button>
    </div>
  );
}
