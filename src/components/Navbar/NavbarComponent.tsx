"use client";

import React, { useState } from "react";
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

const NavbarComponent = () => {
  const pathname = usePathname();
  const { status, data } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationProperties = [
    ...(status === "authenticated"
      ? [
          { id: 1, href: "/yourintake", description: "Your intake" },
          { id: 2, href: "/profile", description: "Profile" },
          { id: 3, href: "/myprogress", description: "My progress" },
        ]
      : []),
  ];

  const showSession = () => {
    if (status === "authenticated") {
      return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button variant="light">{data.user?.name}</Button>
          </DropdownTrigger>

          <DropdownMenu variant="faded">
            <DropdownItem key="profile" href="/profile">
              Profile
            </DropdownItem>

            <DropdownItem
              key="logout"
              className="text-danger"
              onPress={() =>
                signOut({ redirect: false }).then(() => router.push("/"))
              }
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
    }

    return (
      <Link
        href="/login"
        className="border border-solid border-black rounded px-2 py-1"
      >
        Sign In
      </Link>
    );
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle className="sm:hidden" />
        <NavbarBrand>
          <Link href="/">
            <p className="font-bold text-white">FitUp</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navigationProperties.map((navigationProperty) => (
          <NavbarItem
            key={navigationProperty.id}
            isActive={pathname === navigationProperty.href}
          >
            <Link
              href={navigationProperty.href}
              color={
                pathname === navigationProperty.href ? "primary" : "foreground"
              }
            >
              {navigationProperty.description}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-3 ms-auto">
        {showSession()}

        {status === "authenticated" ? (
          <Avatar
            isBordered
            color="secondary"
            size="sm"
            src={data.user?.image || "pfps/3.png"}
          />
        ) : (
          <Link href="/signup">
            <p>Sign up</p>
          </Link>
        )}
      </NavbarContent>

      <NavbarMenu>
        {navigationProperties.map((item) => (
          <NavbarMenuItem key={item.id}>
            <Link
              href={item.href}
              color={pathname === item.href ? "primary" : "foreground"}
              className="w-full"
            >
              {item.description}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavbarComponent;
