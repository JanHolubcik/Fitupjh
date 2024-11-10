"use client";
import ProgressBars from "@/components/ProgressBars/ProgressBars";
import "./calendar.css"; // styling only for calendar

import { useState } from "react";
import Calendar from "react-calendar";import ProfileInfo from "@/components/ProfileInfo/ProfileInfo";
import ProgressBarsProfile from "@/components/ProgressBarsProfile/ProgressBarsProfile";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Profile() {
  const [value, onChange] = useState<Value>(new Date());



  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <ProfileInfo />
      <ProgressBarsProfile date={value} />
      <Calendar locale="en" onChange={onChange} value={value} />
    </main>
  );
}
