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

  const canCalculate =
    data?.user?.goal && data?.user.height && data?.user.weight ? true : false;

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
                    onPress={() => {
                      setEdit({ ...edit, weight: true });
                      setWeight(data?.user?.weight?.toString());
                    }}
                  >
                    <FaPen className="text-sm text-default-400 pointer-events-none flex-shrink-0" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="self-center max-w-36 ml-3 m-1 mr-9">New weight:</p>
              <Input
                type="number"
                value={weight}
                className="self-center max-w-36 m-1"
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
                    onPress={() => {
                      setEdit({ ...edit, height: true });
                      setHeight(data?.user?.height?.toString());
                    }}
                  >
                    <FaPen className="text-sm text-default-400 pointer-events-none flex-shrink-0" />
                  </Button>
                </div>
              </div>
            </>
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
                  onPress={() => {
                    setEdit({ ...edit, goal: true });
                    setGoal(data?.user?.goal);
                  }}
                >
                  <FaPen className="text-sm text-default-400 pointer-events-none flex-shrink-0" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="self-center max-w-36 ml-3 m-1 mr-14">New goal:</p>
              <Select
                className="w-36 self-center m-1  mb-4"
                onChange={(e) => setGoal(e.target.value)}
                value={goal}
              >
                {goals.map((goal) => (
                  <SelectItem className="max-w-34 " key={goal}>
                    {goal}
                  </SelectItem>
                ))}
              </Select>
            </>
          )}
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
