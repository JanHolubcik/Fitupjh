"use client";
import YourIntakeProvider from "@/hooks/YourIntakeProvider";

export default function YourIntake({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <YourIntakeProvider>{children}</YourIntakeProvider>;
}
