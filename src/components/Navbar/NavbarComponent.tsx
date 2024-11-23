"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
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

import React from "react";
import { User } from "next-auth";

const navigationPropeties = [
  {
    id: 1,
    href: "/",
    description: "Home",
  },
  {
    id: 2,
    href: "/yourintake",
    description: "Your intake",
  },
];

type Prop = {
  user:
    | ({
        goal?: string | undefined;
        height?: number | undefined;
        weight?: number | undefined;
      } & User)
    | undefined;
};

const NavbarComponent = (prop: Prop) => {
  const pathname = usePathname();
  const { status } = useSession();
  const router = useRouter();

  const showSession = () => {
    if (prop.user) {
      return (
        <>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light"> {prop.user?.name}</Button>
            </DropdownTrigger>
            <DropdownMenu variant="faded" aria-label="Static Actions">
              <DropdownItem href="/profile" key="new">
                Profile
              </DropdownItem>
              <DropdownItem
                onPress={() =>
                  signOut({ redirect: false }).then(() => {
                    router.push("/");
                    prop.user = undefined;
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
          <p className="font-bold text-inherit">FitUp</p>
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
          {showSession()}

          {prop.user ? (
            <Avatar
              isBordered
              className="transition-transform"
              color="secondary"
              size="sm"
              src="pfps/3.png"
            />
          ) : (
            <Link href="/signup">
              <p>Sign up</p>
            </Link>
          )}
        </NavbarContent>
      </Navbar>
    </>
  );
};

export default NavbarComponent;
