"use client";

import {
  Avatar,
  Button,
  Input,
  Progress,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaCheck, FaPen } from "react-icons/fa";
import ProfileGallery from "../ProfileGallery/ProfileGallery";
import { useMutation } from "@tanstack/react-query";
import { FaPencilAlt } from "react-icons/fa";
import ProfileInfoButton from "./ProfileInfoButton";

type Value = {
  pfps: string[];
};
const goals = ["Lose weight", "Gain weight", "Stay same"];

const ProfileInfo = (props: Value) => {
  const [edit, setEdit] = useState({
    weight: false,
    height: false,
    goal: false,
  });

  const updateUserMutation = useMutation({
    mutationFn: async (payload: {
      email: string;
      height?: number;
      weight?: number;
      goal?: string;
      image?: string;
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

  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [weight, setWeight] = useState<string>();
  const [height, setHeight] = useState<string>();
  const [goal, setGoal] = useState<string>();
  const [pfpImage, setPfpImage] = useState<string>();
  const { data, update } = useSession();
  const [error, setError] = useState("");
  const [showSpinner, setShowSpinner] = useState(true); // Spinner state

  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const handleSelect = (img: string) => {
    setSelectedAvatar(img);
  };

  const handleConfirm = () => {
    if (!selectedAvatar) return;
    setPfpImage(selectedAvatar);
    handleAutoSubmit();
    setShowGallery(false);
  };

  const handleAutoSubmit = async (
    newWeight = weight,
    newHeight = height,
    newGoal = goal,
    newPfpPicture = pfpImage,
    email = data?.user?.email,
  ) => {
    if (newWeight && newHeight && newGoal && newPfpPicture) {
      updateUserMutation.mutate({
        email: email || "",
        weight: Number(newWeight),
        height: Number(newHeight),
        goal: newGoal,
        image: newPfpPicture,
      });
      await update({
        user: {
          ...data?.user,
          weight: newWeight,
          height: newHeight,
          goal: newGoal,
          image: newPfpPicture,
        },
      });
      setEditingField(null);
    }
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (e.key === "Enter") {
      await handleAutoSubmit();
      setEditingField(null);
    }
  };

  const canCalculate =
    data?.user?.goal && data?.user.height && data?.user.weight ? true : false;
  const [editingField, setEditingField] = useState<
    "weight" | "height" | "goal" | null
  >(null);
  useEffect(() => {
    if (data) {
      setHeight(data?.user?.height?.toString());
      setWeight(data?.user?.weight?.toString());
      setGoal(data?.user?.goal);
      setPfpImage(data?.user?.image ?? undefined);
    }
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [data, data?.user]);
  return (
    <div className="flex  flex-col min-w-60 pb-10">
      {showSpinner ? (
        <Spinner />
      ) : (
        <>
          {!showGallery ? (
            <Avatar
              isBordered
              color="secondary"
              src={data?.user?.image || "pfps/3.png"}
              className="transition-transform w-32 h-32 text-large m-1 self-center cursor-pointer"
              onClick={() => setShowGallery(true)}
            />
          ) : (
            <ProfileGallery
              onSelect={handleSelect}
              onConfirm={handleConfirm}
              images={props.pfps}
            />
          )}
          <p className="m-1 self-center ">{data?.user?.name}</p>
          {data?.user?.weight && canCalculate && !edit.weight && (
            <div className="flex justify-evenly items-center m-1">
              <div className=" self-center text-center flex-4">
                {editingField === "weight" ? (
                  <Input
                    type="number"
                    value={weight}
                    autoFocus
                    onChange={(e) => setWeight(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="max-w-36"
                  />
                ) : (
                  <Button
                    className="cursor-pointer flex flex-row bg-transparent hover:bg-gray-800"
                    onPress={() => setEditingField("weight")}
                  >
                    <ProfileInfoButton headline="Weight" value={weight} />
                  </Button>
                )}
              </div>

              {editingField === "weight" && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={async () => {
                    await handleAutoSubmit();
                    setEditingField(null);
                  }}
                >
                  <FaCheck className="text-success" />
                </Button>
              )}
            </div>
          )}
          {data?.user?.height && canCalculate && !edit.height ? (
            <div className="flex justify-evenly items-center m-1">
              <div className=" self-center text-center flex-4">
                {editingField === "height" ? (
                  <Input
                    type="number"
                    value={height}
                    autoFocus
                    onChange={(e) => setHeight(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="max-w-36 "
                  />
                ) : (
                  <Button
                    className="cursor-pointer flex flex-row bg-transparent hover:bg-gray-800"
                    onPress={() => setEditingField("height")}
                  >
                    <ProfileInfoButton headline="Height" value={height} />
                  </Button>
                )}
              </div>

              {editingField === "height" && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={async () => {
                    await handleAutoSubmit();
                    setEditingField(null);
                  }}
                >
                  <FaCheck className="text-success" />
                </Button>
              )}
            </div>
          ) : (
            <>
              <p className="self-center max-w-36 ml-3 m-1  mr-10">
                New height:
              </p>
              <Input
                type="number"
                labelPlacement="outside"
                placeholder={data?.user?.height?.toString()}
                value={height}
                className="self-center max-w-36 m-1"
                onChange={(e) => setHeight(e.target.value)}
                endContent={
                  <FaPen className="text-sm text-default-400 pointer-events-none flex-shrink-0" />
                }
              />
            </>
          )}
          <div className="flex justify-evenly items-center m-1">
            <div className=" self-center text-center  flex-4">
              {editingField === "goal" ? (
                <Select
                  className="w-36"
                  selectedKeys={[goal || ""]}
                  autoFocus
                  onKeyDown={handleKeyDown}
                  onChange={(e) => {
                    setGoal(e.target.value);
                  }}
                >
                  {goals.map((g) => (
                    <SelectItem key={g}>{g}</SelectItem>
                  ))}
                </Select>
              ) : (
                <Button
                  className="cursor-pointer bg-transparent hover:bg-gray-800"
                  onPress={() => setEditingField("goal")}
                >
                  <ProfileInfoButton headline="Goal" value={goal} />
                </Button>
              )}
            </div>

            {editingField === "goal" && (
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={async () => {
                  await handleAutoSubmit();
                  setEditingField(null);
                }}
              >
                <FaCheck className="text-success" />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileInfo;
