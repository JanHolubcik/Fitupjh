"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {Card, CardHeader, CardBody, Button, Link } from "@nextui-org/react";
import { signIn } from "next-auth/react";

export default function Login() {

  const [error, setError] = useState("");
  const router = useRouter(); // after succesfull login we will route to yourintake

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    debugger;
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    console.log('Response from signIn:', res);
    if (res?.error) {
      setError(res.error as string);
    }
    debugger;
    if (res?.ok) {
      return router.push("/");
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <form
        className="p-6 w-full max-w-[400px] flex flex-col justify-between items-center gap-2 
        border border-solid border-white rounded"
        onSubmit={handleSubmit}
      >
        {error && <div className="text-black">{error}</div>}
        <h1 className="mb-5 w-full text-2xl font-bold">Sign In</h1>
        <label className="w-full text-sm">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="w-full h-8 border border-solid border-white rounded p-2"
          name="email"
        />
        <label className="w-full text-sm">Password</label>
        <div className="flex w-full">
          <input
            type="password"
            placeholder="Password"
            className="w-full h-8 border border-solid border-white rounded p-2"
            name="password"
          />
        </div>
        <button className="w-full border border-solid border-white rounded">
          Sign In
        </button>
        <Link
          href="/register"
          className="text-sm text-[#888] transition duration-150 ease hover:text-black"
        >
          Do not have an account?
        </Link>
      </form>
    </section>
  );
}
