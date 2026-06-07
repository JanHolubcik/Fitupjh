import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <Spinner size="lg" color="white" />
    </div>
  );
}
