"use client";

import React from "react";
import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-65px)] w-full items-center justify-center bg-[#09090b] dark:bg-[#09090b]">
      <Spinner size="lg" color="primary" />
    </div>
  );
}
