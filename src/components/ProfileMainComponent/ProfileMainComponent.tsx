"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import ProfileInfo from "../ProfileInfo/ProfileInfo";
import ProgressBarsProfile from "../ProgressBarsProfile/ProgressBarsProfile";

type Value = ValuePiece | [ValuePiece, ValuePiece];
type ValuePiece = Date | null;
export default function ProfileMainComponent({ images }: { images: string[] }) {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <ProfileInfo pfps={images} />
      <ProgressBarsProfile date={value} />
      <Calendar locale="en" onChange={onChange} value={value} />
    </main>
  );
}
