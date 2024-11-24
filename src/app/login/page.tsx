"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Link, Input, Button } from "@nextui-org/react";
import { signIn } from "next-auth/react";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter(); // after succesfull login we will route to yourintake

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    //next auth logging to session
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    console.log("Response from signIn:", res);
    if (res?.error) {
      setError(res.error as string);
    }

    if (res?.ok) {
      return router.push("/");
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <form
        className="p-6 w-full max-w-[400px] flex flex-col justify-between items-center gap-2 
        bg-zinc-900 rounded-2xl"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-5 w-full text-2xl font-bold">Sign In</h1>
        <label className="w-full text-sm ml-2">Email</label>
        <Input
          type="email"
          placeholder="Email"
          className="w-full    m-1"
          name="email"
        />
        <label className="w-full text-sm ml-2">Password</label>

        <Input
          type="password"
          placeholder="Password"
          className="w-full   m-1"
          name="password"
        />
        {error && <div className="text-red-600">{error}</div>}
        <Button className="self-center w-32 mt-5" type="submit" isIconOnly>
          Sign In
        </Button>
        <Link
          href="/signup"
          className="text-sm text-[#888] transition duration-150 ease hover:text-white"
        >
          Do not have an account?
        </Link>
      </form>
    </section>
  );
}
