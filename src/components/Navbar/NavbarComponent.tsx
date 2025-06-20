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

const NavbarComponent = () => {
  const pathname = usePathname();
  const { status, data } = useSession();
  const router = useRouter();

  const navigationProperties = [
    ...(status === "authenticated"
      ? [
          {
            id: 2,
            href: "/yourintake",
            description: "Your intake",
          },
          {
            id: 2,
            href: "/profile",
            description: "Profile",
          },
        ]
      : []),
  ];
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
          <Link href="/">
            <p className="font-bold text-inherit text-white">FitUp</p>
          </Link>
        </NavbarBrand>

        <NavbarContent className="sm:flex gap-4" justify="center">
          {navigationProperties.map((navigationProperty) => (
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

          {status === "authenticated" ? (
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
