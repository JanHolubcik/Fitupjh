"use client";

import { ProfileSkeleton } from "./ProfileMainComponent/components/ProfileSkeleton";

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-65px)] w-full items-center justify-center bg-[#09090b] dark:bg-[#09090b]">
      <ProfileSkeleton />
    </div>
  );
}
