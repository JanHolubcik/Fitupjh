import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  Input,
  Avatar,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import ProfileGallery from "../ProfileGallery/ProfileGallery";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import React from "react";

type props = {
  onOpenChange: () => void;
  isOpen: boolean | undefined;
  images: string[];
  onClose: () => void;
  initialValues: {
    weight: number | undefined;
    height: number | undefined;
    name: string | null | undefined;
    email: string | null | undefined;
  };
};

type UserFormData = {
  userName: string;
  email: string;
  weight: string; // Initially a string from FormData
  height: string; // Initially a string from FormData
};

const EditPersonCharacteristic = (props: props) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(
      formData.entries(),
    ) as unknown as UserFormData;

    handleManualSubmit(
      data.weight,
      data.height,
      "lose weight",
      selectedAvatar || "pfps/3.png",
      data.email,
      data.userName,
    );
  };

  const { data, update } = useSession();

  const {
    isOpen: isGalleryOpen,
    onOpen: onOpenGallery,
    onOpenChange: onGalleryChange,
    onClose: onCloseGallery,
  } = useDisclosure({ id: "EditPersonCharacteristic" });
  const updateUserMutation = useMutation({
    mutationFn: async (payload: {
      email: string;
      height?: number;
      weight?: number;
      goal?: string;
      image?: string;
      name?: string;
    }) => {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
  });

  const handleManualSubmit = async (
    newWeight: string,
    newHeight: string,
    newGoal: string,
    newPfpPicture: string,
    email = data?.user?.email,
    name: string,
  ) => {
    try {
      const updatePromise = (async () => {
        await updateUserMutation.mutateAsync({
          email: email || "",
          weight: Number(newWeight),
          height: Number(newHeight),
          goal: newGoal,
          image: newPfpPicture,
          name: name || "",
        });

        const sessionUpdate = await update({
          user: {
            ...data?.user,
            weight: Number(newWeight),
            height: Number(newHeight),
            goal: newGoal,
            image: newPfpPicture,
            email: email,
            name: name,
          },
        });

        if (!sessionUpdate) throw new Error("Session update failed");
        return sessionUpdate;
      })();

      await toast.promise(
        updatePromise,
        {
          pending: "Updating profile...",
          success: "Profile updated successfully!",
          error: {
            render({ data }: any) {
              return data?.message || "Failed to update profile.";
            },
          },
        },
        {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        },
      );

      props.onClose(); // Only close on success
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  return (
    <>
      <Modal
        placement="center"
        hideCloseButton
        size="lg"
        isOpen={props.isOpen}
        isDismissable={false}
        onOpenChange={() => {
          props.onOpenChange();
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalBody>
                <form
                  className="flex flex-col gap-4 mt-5"
                  onSubmit={handleSubmit}
                >
                  <Avatar
                    isBordered
                    color="secondary"
                    src={
                      selectedAvatar
                        ? selectedAvatar
                        : data?.user?.image || "pfps/3.png"
                    }
                    className="transition-transform mt-5 w-32 h-32 text-large m-1 self-center cursor-pointer"
                    onClick={onOpenGallery}
                  />

                  <Button
                    className="max-w-xs self-center"
                    color="secondary"
                    onPress={onOpenGallery}
                  >
                    Change your profile picture
                  </Button>
                  <div>
                    <p className="m-1 ml-2">Name</p>
                    <Input
                      name="userName"
                      classNames={{
                        inputWrapper:
                          "transition-all duration-200 ring-1 ring-transparent focus-within:ring-[#00FFAA] focus-within:ring-2 shadow-md focus-within:shadow-[#00FFAA]/50",
                        input: "text-white",
                        label: "text-white",
                      }}
                      type="text"
                      defaultValue={props.initialValues.name || ""}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <p className="m-1 ml-2">Email</p>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      defaultValue={props.initialValues.email || ""}
                      required
                    />
                  </div>

                  <p className="m-1 ml-2">Todo password change</p>

                  <div>
                    <p className="m-1 ml-2">Weight</p>
                    <Input
                      name="weight"
                      type="number"
                      placeholder="Weight"
                      defaultValue={
                        props.initialValues.weight?.toString() || ""
                      }
                      required
                    />
                  </div>
                  <div>
                    <p className="m-1 ml-2">Height</p>
                    <Input
                      name="height"
                      type="number"
                      placeholder="Height"
                      defaultValue={
                        props.initialValues.height?.toString() || ""
                      }
                      required
                    />
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      color="success"
                      className="font-bold flex-1"
                      type="submit"
                    >
                      Submit
                    </Button>
                    <Button
                      onPress={props.onClose}
                      color="danger"
                      className="font-bold flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <ProfileGallery
        images={props.images}
        onConfirm={(val) => {
          setSelectedAvatar(val);
          onCloseGallery();
        }}
        onOpenChange={onGalleryChange}
        isOpen={isGalleryOpen}
      ></ProfileGallery>
    </>
  );
};

export default EditPersonCharacteristic;
