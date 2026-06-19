"use client";

import { CardUniversal } from "@/components/common";
import { CardBody, CardHeader, Divider, Skeleton } from "@heroui/react";

export const ProfileSkeleton = () => {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6 animate-pulse">
      {/* 1. Language & Theme Card (Mobile only) */}
      <CardUniversal className="flex sm:hidden shadow-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-2 pt-6 px-6">
          <Skeleton className="h-6 w-48 rounded-lg" />
        </CardHeader>
        <Divider className="bg-zinc-200 dark:bg-zinc-800" />
        <CardBody className="px-6 py-2 flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0">
            <div className="flex flex-col gap-2 pr-4 w-3/4">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-3 w-40 rounded-md" />
            </div>
            <Skeleton className="h-8 w-14 rounded-full shrink-0" />
          </div>
          <div className="flex flex-row items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0">
            <div className="flex flex-col gap-2 pr-4 w-3/4">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-3 w-48 rounded-md" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg shrink-0" />
          </div>
        </CardBody>
      </CardUniversal>

      {/* 2. Account Details Card */}
      <CardUniversal className="shadow-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-2 pt-6 px-6 flex flex-col items-start gap-2">
          <Skeleton className="h-6 w-36 rounded-lg" />
          <Skeleton className="h-3 w-56 rounded-md" />
        </CardHeader>
        <Divider className="bg-zinc-200 dark:bg-zinc-800" />
        <CardBody className="px-6 py-6 flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex flex-col items-center gap-3 shrink-0 mx-auto sm:mx-0">
            <Skeleton className="w-20 h-20 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="flex sm:justify-end">
              <Skeleton className="h-8 w-full sm:w-24 rounded-lg" />
            </div>
          </div>
        </CardBody>
      </CardUniversal>

      {/* 3. Change Password Card */}
      <CardUniversal className="shadow-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-2 pt-6 px-6 flex flex-col items-start gap-2">
          <Skeleton className="h-6 w-40 rounded-lg" />
          <Skeleton className="h-3 w-64 rounded-md" />
        </CardHeader>
        <Divider className="bg-zinc-200 dark:bg-zinc-800" />
        <CardBody className="px-6 py-6 flex flex-col gap-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="flex sm:justify-end">
            <Skeleton className="h-8 w-full sm:w-28 rounded-lg" />
          </div>
        </CardBody>
      </CardUniversal>

      {/* 4. Biometric & Goals Card */}
      <CardUniversal className="shadow-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-2 pt-6 px-6 flex flex-col items-start gap-2">
          <Skeleton className="h-6 w-44 rounded-lg" />
          <Skeleton className="h-3 w-60 rounded-md" />
        </CardHeader>
        <Divider className="bg-zinc-200 dark:bg-zinc-800" />
        <CardBody className="px-6 py-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="flex sm:justify-end">
            <Skeleton className="h-8 w-full sm:w-24 rounded-lg" />
          </div>
        </CardBody>
      </CardUniversal>

      {/* 5. Delete Account Card */}
      <CardUniversal className="shadow-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="pb-2 pt-6 px-6 flex flex-col items-start gap-2">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <Skeleton className="h-3 w-56 rounded-md" />
        </CardHeader>
        <Divider className="bg-zinc-200 dark:bg-zinc-800" />
        <CardBody className="px-6 py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
          </div>
          <div className="flex sm:justify-end">
            <Skeleton className="h-8 w-full sm:w-28 rounded-lg" />
          </div>
        </CardBody>
      </CardUniversal>
    </div>
  );
};
