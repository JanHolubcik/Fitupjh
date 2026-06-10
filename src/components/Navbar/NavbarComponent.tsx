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

import imagepfp3 from "../../../public/pfps/3.png";

import { signOut, useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { InputSearchBar } from "../InputSearchBar/InputSearchBar";
import { LanguagePicker } from "./components/LanguagePicker";
import { useT } from "next-i18next/client";

const NavbarComponent = () => {
  const pathname = usePathname();
  const { t } = useT("navbar");
  const { status, data } = useSession();
  const router = useRouter();

  const params = useParams();
  const lng = params?.lng || "en";

  const navigationProperties = [
    ...(status === "authenticated"
      ? [
          { id: 1, href: `/${lng}/dashboard`, description: t("dashboard") },
          { id: 2, href: `/${lng}/profile`, description: t("profile") },
        ]
      : []),
  ];

  const showSession = () => {
    if (status === "authenticated") {
      return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              variant="light"
              size="md"
              className="text-zinc-200 font-medium"
            >
              <Avatar
                isBordered
                color="secondary"
                size="sm"
                src={data.user?.image || imagepfp3.src}
                className="cursor-pointer transition-transform hover:scale-105 shrink-0"
              />
            </Button>
          </DropdownTrigger>

          <DropdownMenu variant="faded" aria-label="User menu actions">
            <DropdownItem key="profile" href="/profile">
              {t("profile")}
            </DropdownItem>

            <DropdownItem
              key="logout"
              className="text-danger"
              color="danger"
              onPress={() =>
                signOut({ redirect: false }).then(() => router.push("/"))
              }
            >
              {t("logout")}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
    }

    return (
      <Button
        as={Link}
        href="/login"
        variant="bordered"
        size="sm"
        className="border-white/20 text-white hover:bg-white/10"
      >
        {t("signIn")}
      </Button>
    );
  };

  return (
    <Navbar
      isBordered
      className="bg-zinc-950/70 border-white/5 backdrop-blur-md"
      maxWidth="xl"
    >
      <NavbarContent justify="start" className="flex-grow-0">
        <NavbarMenuToggle className="sm:hidden text-white mr-2" />
        <NavbarBrand className="gap-5">
          <Link href="/" className="gap-2 hidden sm:flex">
            <p className="font-black text-xl text-white tracking-wider bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              FitUp
            </p>
          </Link>
          <div className="hidden sm:flex gap-5">
            {navigationProperties.map((item) => (
              <NavbarItem key={item.href} isActive={pathname === item.href}>
                <Link
                  href={item.href}
                  color={pathname === item.href ? "primary" : "foreground"}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {item.description}
                </Link>
              </NavbarItem>
            ))}
          </div>
        </NavbarBrand>
      </NavbarContent>
      {status === "authenticated" && (
        <NavbarContent className=" sm:flex gap-6" justify="start">
          <InputSearchBar />
        </NavbarContent>
      )}

      <NavbarContent justify="end" className="flex-1 gap-4">
        <div className="flex items-center gap-2">
          {LanguagePicker()}
          {showSession()}

          {status !== "authenticated" && (
            <Button
              as={Link}
              href="/signup"
              color="primary"
              size="sm"
              className="font-medium"
            >
              {t("signUp")}
            </Button>
          )}
        </div>
      </NavbarContent>

      <NavbarMenu className="bg-zinc-950/95 pt-6 gap-4">
        <NavbarMenuItem>
          <p className="font-black text-xl text-white tracking-wider bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            FitUp
          </p>
        </NavbarMenuItem>
        {navigationProperties.map((item) => (
          <NavbarMenuItem key={item.id}>
            <Link
              href={item.href}
              color={pathname === item.href ? "primary" : "foreground"}
              className="w-full text-lg py-2 border-b border-white/5"
              size="lg"
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
