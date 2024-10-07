"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, userEmail, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("User created successfully!");
      router.push("/login"); // Redirect to login page after successful signup
    } else {
      alert(`Error: ${data.error}`);
    }
  };

  return (
    <main className=" self-center flex min-h-screen flex-col items-center justify-between p-11 ">
      <Card className="max-w-[500px] min-w-[400px] p-2 mt-5">
        <CardHeader className="flex flex-col items-center bg-zinc-900">
          <h1 className="self-center mb-5">Sign up!</h1>
          <p className="max-w-72 text-center">
            Create an account to start tracking your calories.
          </p>
        </CardHeader>
        <CardBody className="bg-zinc-900 flex flex-col">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <p className="m-1 mt-4">User name </p>
            <input
              className="mr-1 ml-1"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <p className="m-1 mt-4">User email </p>
            <input
              className="mr-1 ml-1"
              type="email"
              placeholder="Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
            <p className="m-1 mt-4">User password </p>
            <input
              className="mr-1 ml-1"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
           
            <Button className="self-center w-32 mt-5" type="submit" isIconOnly>
              <p>Sign up!</p>
            </Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
