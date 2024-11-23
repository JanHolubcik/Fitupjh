import React from "react";

import Food from "./Food";
import { getServerSession } from "next-auth";
import { SessionProvider } from "../SessionProvider";

export default async function YourIntake() {
  return <Food></Food>;
}
