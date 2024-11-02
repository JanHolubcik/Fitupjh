"use client";
import ProgressBars from "@/components/ProgressBars/ProgressBars";
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
import ProfileInfo from "@/components/ProfileInfo/ProfileInfo";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

type goalsType = "lose weight" | "gain weight" | "stay same";
const goals = ["Lose weight", "Gain weight", "Stay same"];

export default function Profile() {
  const [value, onChange] = useState<Value>(new Date());

  const getFoodInDay = () => {};

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <ProfileInfo />
      <ProgressBars date={value} />
      <Calendar locale="en" onChange={onChange} value={value} />
    </main>
  );
}
