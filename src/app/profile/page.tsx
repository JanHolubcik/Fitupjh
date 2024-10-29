import TimeFrame from "@/components/TimeFrame/TimeFrame";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import Calendar from "react-calendar";

export default function Profile() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Calendar />
      </div>
    </main>
  );
}
