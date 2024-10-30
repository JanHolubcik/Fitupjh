"use client";
import "./calendar.css"; // styling only for calendar
import TimeFrame from "@/components/TimeFrame/TimeFrame";
import {
  Avatar,
  Button,
  Input,
  Progress,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import { FaCheck } from "react-icons/fa";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

type goalsType = "lose weight" | "gain weight" | "stay same";
const goals = ["Lose weight", "Gain weight", "Stay same"];
export default function Profile() {
  const [value, onChange] = useState<Value>(new Date());
  const { data } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex  flex-col pb-10">
        <Avatar
          isBordered
          color="secondary"
          src="pfps/3.png"
          className="transition-transform w-32 h-32 text-large m-1 self-center"
        />
        <p className="m-1 self-center">{data?.user?.name}</p>
        <Input
          type="number"
          label="Your weight"
          placeholder="Place your weight here"
          className="max-w-54 m-2"
          size="sm"
        />
        <Input
          className="max-w-54 m-2"
          size="sm"
          type="number"
          label="Your height"
          placeholder="Place your height here"
        />

        <Select size="sm" label="Select your goal" className="max-w-xs m-2">
          {goals.map((goal) => (
            <SelectItem key={goal}>{goal}</SelectItem>
          ))}
        </Select>
        <Button size="sm" className="max-w-12 rounded-large self-center ">
          <FaCheck color="#08ca1f" size={15} />
        </Button>
      </div>
      <div className="flex flex-col min-w-96">
        <h1 className="self-center text-lg m-3 ">Today intake</h1>

        <div className="flex flex-row ">
          <Progress
            label="Protein"
            showValueLabel
            value={55}
            className="max-w-md m-2"
          />
          <Progress
            label="Fat"
            showValueLabel
            value={55}
            className="max-w-md m-2"
          />
        </div>
        <div className="flex flex-row">
          <Progress
            label="Sugar"
            showValueLabel
            value={55}
            className="max-w-md m-2"
          />
          <Progress
            label="Carbohydrates"
            showValueLabel
            value={55}
            className="max-w-md m-2"
          />
        </div>
        <div className="flex flex-row">
          <Progress
            label="Fiber"
            showValueLabel
            value={55}
            className="max-w-md m-2"
          />
          <Progress
            label="Salt"
            showValueLabel
            value={55}
            className="max-w-md m-2"
          />
        </div>
        <Progress
          label="Calories"
          showValueLabel
          value={55}
          className="max-w-80 m-2 self-center"
        />
      </div>
      <Calendar locale="en" onChange={onChange} value={value} />
    </main>
  );
}
