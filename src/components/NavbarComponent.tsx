"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {Spinner} from "@nextui-org/spinner";

import React from "react";
import { useState } from "react";

const navigationPropeties = [
  {
    id: 1,
    href: "/food",
    description: "Food",
  },
  {
    id: 2,
    href: "/yourintake",
    description: "Your intake",
  },
];

const NavbarComponent = () => {
  const pathname = usePathname();
  const { status, data } = useSession();
  const router = useRouter();

  const showSession = () => {
    if (status === "authenticated") {
      return (
        <>
     <Dropdown>
            <DropdownTrigger>
              <Button variant="light"> {data.user?.name}</Button>
            </DropdownTrigger>
            <DropdownMenu variant="faded" aria-label="Static Actions">
              <DropdownItem href="/profile" key="new">
                Profile
              </DropdownItem>
              <DropdownItem
                onPress={() =>
                  signOut({ redirect: false }).then(() => {
                    router.push("/");
                  })
                }
                key="copy"
                className="text-danger"
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </>
      );
    } else if (status === "loading") {
      return <Spinner />;
    } else {
      return (
        <Link
          href="/login"
          className="border border-solid border-black rounded"
        >
          Sign In
        </Link>
      );
    }
  };
  return (
    <>
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {navigationPropeties.map((navigationProperty) => (
            <NavbarItem
              key={navigationProperty.id}
              isActive={pathname === navigationProperty.href ? true : false}
            >
              <Link
                color={
                  pathname === navigationProperty.href
                    ? "primary"
                    : "foreground"
                }
                aria-current="page"
                href={navigationProperty.href}
              >
                {navigationProperty.description}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent as="div" justify="end">
        <Button variant="light"> {showSession()}</Button>
        

         {status === "authenticated" ?   <Avatar
              isBordered
              className="transition-transform"
              color="secondary"
              size="sm"
              src="pfps/3.png"
            /> :<Link href="/signup">
            <p>Sign up</p>
          </Link>}  
        </NavbarContent>
      </Navbar>
    </>
  );
};

export default NavbarComponent;
