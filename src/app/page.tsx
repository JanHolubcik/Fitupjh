import TodoFormServerComponent from "@/components/todo-form-server";
import TodoItemServerComponent from "@/components/todo-item-server";
import { getTodos } from "@/lib/todo-db";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";

import Image from "next/image";
import { getFood, getFoods } from "@/lib/food-db";

export default async function Home() {
  //const { todos, results } = await getTodos();

  return (
    <main className="dark  flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p>Black coffe yummi</p>

        <h1 className="text-2xl font-bold mb-4">Food List</h1>

      </div>
    </main>
  );
}
