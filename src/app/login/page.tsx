"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Link, Input, Button, Spinner } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import PulsingButton from "@/components/PulsingButton/PulsingButton";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter(); // after succesfull login we will route to yourintake
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    //next auth logging to session
    setLoading(true);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError(res.error as string);
    }

    if (res?.ok) {
      return router.push("/");
    }
  };

  if (loading) {
    return (
      <section className="w-full h-screen flex flex-col items-center justify-center">
        <div className="bg-zinc-900 rounded-2xl   p-10 flex flex-col ">
          <p className="m-1 ">Please wait while we log you in...</p>
          <Spinner className="m-3 self-center" color="current"></Spinner>
        </div>
      </section>
    );
  }

  return (
    <section className="dark mt-20 flex flex-col items-center justify-start sm:p-10 p-6">
      <form
        className="p-6 w-full max-w-[400px] flex flex-col justify-between items-center gap-2 
        bg-zinc-900 rounded-2xl"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-5 w-full text-2xl font-bold">Sign In</h1>
        <label className="w-full text-sm ml-3 pb-1">Email</label>
        <Input
          type="email"
          placeholder="Email"
          classNames={{
            inputWrapper:
              "transition-all duration-200 ring-1 ring-transparent focus-within:ring-[#00FFAA] focus-within:ring-2 shadow-md focus-within:shadow-[#00FFAA]/50",
            input: "text-white ",
            label: "text-white",
          }}
          name="email"
        />
        <label className="w-full text-sm ml-3 pt-1 pb-1">Password</label>

        <Input
          type="password"
          placeholder="Password"
          classNames={{
            inputWrapper:
              "transition-all duration-200 ring-1 ring-transparent focus-within:ring-[#00FFAA] focus-within:ring-2 shadow-md focus-within:shadow-[#00FFAA]/50",
            input: "text-white",
            label: "text-white",
          }}
          name="password"
        />
        {error && <div className="text-red-600">{error}</div>}

        <PulsingButton
          className="self-center w-32 mt-5"
          type="submit"
          isIconOnly
          noPulsing
        >
          Sign In
        </PulsingButton>
        <Link
          href="/signup"
          className="text-sm text-[#888] transition duration-150 ease hover:text-white hover:scale-110"
        >
          Do not have an account?
        </Link>
      </form>
    </section>
  );
}
