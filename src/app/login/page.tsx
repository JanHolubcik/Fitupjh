'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, Button } from '@nextui-org/react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter(); // after succesfull login we will route to yourintake
    const handleSubmit = async (e:any) => {
        e.preventDefault();
            // logic for login
    };

    return (
        <main className=" self-center flex min-h-screen flex-col items-center justify-between p-11 ">
        <Card  className="max-w-[500px] min-w-[400px] p-2 mt-5">
          <CardHeader className="flex flex-col items-center bg-zinc-900">
            <h1 className="self-center mb-5">Log in!</h1>
            <p className="max-w-72 text-center">
              Login to start tracking your calories.
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
                <p>Login up!</p>
              </Button>
            </form>
          </CardBody>
        </Card>
      </main>
    );
}
