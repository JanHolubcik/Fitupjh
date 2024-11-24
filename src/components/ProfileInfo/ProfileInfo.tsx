"use client";
import { getSavedUser, getUpdateUser } from "@/lib/YourIntake/search-db";
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
  const [goal, setGoal] = useState<string>("");
  const { data, update } = useSession();
  const [error, setError] = useState("");
  const [showSpinner, setShowSpinner] = useState(true); // Spinner state

  const handleSubmit = async () => {
    if (weight && height && goal) {
      await getUpdateUser(Number(height), Number(weight), goal).catch((err) =>
        console.log(err)
      );
      await update({
        user: { ...data?.user, weight: weight, height: height, goal: goal },
      });
      setEdit({ weight: false, height: false, goal: false });
    } else {
      setError("Please fill out all inputs");
    }
  };

  const canCalculate =
    data?.user?.goal && data?.user.height && data?.user.weight ? true : false;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [data?.user?.height, data?.user?.weight]);
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
          {data?.user?.weight && canCalculate && !edit.weight ? (
            <>
              <div className="flex justify-evenly m-1">
                <div className="w-36 self-center flex-4">
                  <p>Weight: {data?.user?.weight} kg</p>
                </div>
                <div>
                  <Button
                    className="bg-transparent border-none"
                    size="sm"
                    variant="ghost"
                    isIconOnly
                    onPress={() => setEdit({ ...edit, weight: true })}
                  >
                    <FaPen className="text-sm text-default-400 pointer-events-none flex-shrink-0" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="max-w-54 ml-3 m-1">New weight:</p>
              <Input
                type="number"
                placeholder={data?.user?.weight?.toString()}
                className="max-w-54 m-1"
                endContent={
                  <FaPen className="text-sm text-default-400 pointer-events-none flex-shrink-0" />
                }
                onChange={(e) => setWeight(e.target.value)}
              />
            </>
          )}

          {data?.user?.height && canCalculate && !edit.height ? (
            <>
              <div className="flex justify-evenly m-1">
                <div className="w-36 self-center flex-4 ">
                  <p>Height: {data?.user?.height} cm</p>
                </div>
                <div className=" self-center flex-2">
                  <Button
                    className="bg-transparent border-none"
                    size="sm"
                    variant="ghost"
                    isIconOnly
                    onPress={() => setEdit({ ...edit, height: true })}
                  >
                    <FaPen className="text-sm text-default-400 pointer-events-none flex-shrink-0" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="max-w-54 ml-3 m-1">New Height:</p>
              <Input
                type="number"
                labelPlacement="outside"
                placeholder="Put your weight here"
                className="max-w-54 m-1"
                onChange={(e) => setHeight(e.target.value)}
                endContent={
                  <FaPen className="text-sm text-default-400 pointer-events-none flex-shrink-0" />
                }
              />
            </>
          )}
          {data?.user?.goal && canCalculate && !edit.goal ? (
            <div className="flex justify-evenly m-1">
              <div className="w-36 self-center flex-4 ">
                <p>goal: {data?.user?.goal} </p>
              </div>
              <div className=" self-center flex-2">
                <Button
                  className="bg-transparent border-none"
                  size="sm"
                  variant="ghost"
                  isIconOnly
                  onPress={() => setEdit({ ...edit, goal: true })}
                >
                  <FaPen className="text-sm text-default-400 pointer-events-none flex-shrink-0" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Select
                labelPlacement="outside"
                label="Select your goal:"
                className="max-w-40  self-center mb-4"
                onChange={(e) => setGoal(e.target.value)}
              >
                {goals.map((goal) => (
                  <SelectItem className="max-w-54 " key={goal}>
                    {goal}
                  </SelectItem>
                ))}
              </Select>
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
