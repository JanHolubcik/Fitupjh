"use client";

import { ProfileSkeleton } from "./ProfileMainComponent/components/ProfileSkeleton";

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-65px)] w-full items-center justify-center bg-zinc-100 dark:bg-background">
      <ProfileSkeleton />
    </div>
  );
}
