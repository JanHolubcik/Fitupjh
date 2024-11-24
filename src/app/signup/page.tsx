"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Link,
  Tooltip,
} from "@nextui-org/react";
import { FaInfoCircle } from "react-icons/fa";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        userEmail,
        password,
        weight,
        height,
      }),
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
          <h1 className="mb-5 w-full text-2xl text-center font-bold">
            Sign up!
          </h1>
          <p className="max-w-72 text-center">
            Create an account to start tracking your calories.
          </p>
        </CardHeader>
        <CardBody className="bg-zinc-900 flex flex-col">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <p className="m-1 ml-2 mt-4">User name </p>
            <Input
              className="mr-1 ml-1"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <p className="m-1 ml-2 mt-4">User email </p>
            <Input
              className="mr-1 ml-1"
              type="email"
              placeholder="Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
            <p className="m-1 ml-2 mt-4">User password </p>
            <Input
              className="mr-1 ml-1"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex flex-row">
              <span className="m-1 ml-2 mt-4">Height</span>{" "}
              <Tooltip
                showArrow
                content={
                  <div className="p-1 m-1 max-w-64">
                    <h1 className="bold text-center font-bold  mb-1 text-b">
                      Why do we need this information?
                    </h1>
                    <div className="m-1 self-center ">
                      <span className="ml-0 ">
                        Knowing your weight, height and goal helps us determine
                        your macros for the day.
                      </span>
                    </div>
                  </div>
                }
              >
                <div className="m-0 gap-0 p-0  bg-transparent cursor-default">
                  <FaInfoCircle className=" mt-5 "></FaInfoCircle>
                </div>
              </Tooltip>
            </div>
            <Input
              className="mr-1 ml-1"
              type="number"
              max={250}
              placeholder="Height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
            />
            <div className="flex flex-row">
              <span className="m-1 ml-2 mt-4">Weight</span>{" "}
              <Tooltip
                showArrow
                content={
                  <div className="p-1 m-1 max-w-64">
                    <h1 className="bold text-center font-bold  mb-1 text-b">
                      Why do we need this information?
                    </h1>
                    <div className="m-1 self-center ">
                      <span className="ml-0 ">
                        Knowing your weight, height and goal helps us determine
                        your macros for the day.
                      </span>
                    </div>
                  </div>
                }
              >
                <div className="m-0 gap-0 p-0  bg-transparent cursor-default">
                  <FaInfoCircle className=" mt-5 "></FaInfoCircle>
                </div>
              </Tooltip>
            </div>
            <Input
              className="mr-1 ml-1"
              type="number"
              placeholder="Weight"
              max={400}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />

            <Button className="self-center w-32 mt-5" type="submit" isIconOnly>
              <p>Sign up!</p>
            </Button>
            <Link
              href="/signup"
              className="text-sm self-center mt-2 text-[#888] transition duration-150 ease hover:text-white"
            >
              Already have an account?
            </Link>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
