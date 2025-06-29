"use client";
import { getUpdateUser } from "@/lib/YourIntake/search-db";
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

const goals = ["Lose weight", "Gain weight", "Stay same"];

const ProfileInfo = () => {
  const [edit, setEdit] = useState({
    weight: false,
    height: false,
    goal: false,
  });
  const [weight, setWeight] = useState<string>();
  const [height, setHeight] = useState<string>();
  const [goal, setGoal] = useState<string>();
  const { data, update } = useSession();
  const [error, setError] = useState("");
  const [showSpinner, setShowSpinner] = useState(true); // Spinner state

  const handleAutoSubmit = async (
    newWeight = weight,
    newHeight = height,
    newGoal = goal
  ) => {
    if (newWeight && newHeight && newGoal) {
      await getUpdateUser(Number(newHeight), Number(newWeight), newGoal).catch(
        console.log
      );
      await update({
        user: {
          ...data?.user,
          weight: newWeight,
          height: newHeight,
          goal: newGoal,
        },
      });
      setEditingField(null);
    }
  };

  const handleSubmit = async () => {
    if (weight && height && goal) {
      await getUpdateUser(Number(height), Number(weight), goal).catch((err) =>
        console.log(err)
      );
      await update({
        user: { ...data?.user, weight: weight, height: height, goal: goal },
      });
      setEdit({ weight: false, height: false, goal: false });
      setError("");
    } else {
      setError("Please fill out all inputs");
    }
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
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
          <Avatar
            isBordered
            color="secondary"
            src="pfps/3.png"
            className="transition-transform w-32 h-32 text-large m-1 self-center"
          />
          <p className="m-1 self-center ">{data?.user?.name}</p>
          {data?.user?.weight && canCalculate && !edit.weight && (
            <div className="flex justify-evenly items-center m-1">
              <div className="w-36 self-center text-center flex-4">
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
                  <p
                    className="cursor-pointer"
                    onClick={() => setEditingField("weight")}
                  >
                    Weight: {weight} kg
                  </p>
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
              <div className="w-36 self-center text-center flex-4">
                {editingField === "height" ? (
                  <Input
                    type="number"
                    value={height}
                    autoFocus
                    onChange={(e) => setHeight(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="max-w-36"
                  />
                ) : (
                  <p
                    className="cursor-pointer"
                    onClick={() => setEditingField("height")}
                  >
                    Height: {height} cm
                  </p>
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
            <div className="w-36 self-center text-center  flex-4">
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
                <p
                  className="cursor-pointer"
                  onClick={() => setEditingField("goal")}
                >
                  Goal: {goal}
                </p>
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

          {(edit.goal || edit.height || edit.weight) && (
            <>
              <p className="text-red-600 text-center mb-2">{error}</p>
              <Button
                onPress={() => handleSubmit()}
                size="sm"
                className="max-w-12 rounded-large self-center "
              >
                <FaCheck color="#08ca1f" size={15} />
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileInfo;
