"use client";
import "./calendar.css"; // styling only for calendar
import TimeFrame from "@/components/TimeFrame/TimeFrame";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Profile() {
  const [value, onChange] = useState<Value>(new Date());
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Calendar locale="en" onChange={onChange} value={value} />
    </main>
  );
}
