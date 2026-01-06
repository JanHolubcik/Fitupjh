"use client";
import YourIntakeProvider from "@/hooks/YourIntakeProvider";
import { Food } from "@/models/Food";

import { format } from "date-fns";

export default function YourIntakeClientWrapper({
  userID,
}: {
  userID: string;
}) {
  const today = format(new Date(), "yyyy-MM-dd");
  return (
    <YourIntakeProvider date={today} userID={userID}>
      <Food />
    </YourIntakeProvider>
  );
}
