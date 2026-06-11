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
  useDisclosure,
} from "@nextui-org/react";

import imagepfp3 from "../../../public/pfps/3.png";

import { signOut, useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { InputSearchBar } from "../InputSearchBar/InputSearchBar";
import { LanguagePicker } from "./components/LanguagePicker";
import { useT } from "next-i18next/client";
import {
  FaChartArea,
  FaSignOutAlt,
  FaUserAlt,
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaPlus,
} from "react-icons/fa";
import { ModalFindFood } from "../Findfood/components/ModalFindFood";

const NavbarComponent = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
        <Dropdown className="hidden sm:block" placement="bottom-end">
          <DropdownTrigger className="hidden sm:block">
            <Button
              variant="light"
              size="md"
              className="text-zinc-200 font-medium min-w-min px-0 sm:px-2"
            >
              <Avatar
                isBordered
                color="secondary"
                size="sm"
                src={data?.user?.image || imagepfp3.src}
                className="cursor-pointer transition-transform hover:scale-105 shrink-0"
              />
            </Button>
          </DropdownTrigger>

          <DropdownMenu variant="faded" aria-label="User menu actions">
            <DropdownItem key="profile" href={`/${lng}/profile`}>
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
        className="hidden sm:flex border-white/20 text-white hover:bg-white/10"
      >
        {t("signIn")}
      </Button>
    );
  };

  return (
    <>
      <Navbar
        isBordered
        className=" sm:flex hidden bg-default-50/50 border-white/10 sm:bg-zinc-950/70 sm:border-white/5 backdrop-blur-md"
        maxWidth="xl"
      >
        <NavbarContent
          justify="start"
          className={
            status === "authenticated"
              ? "hidden sm:flex flex-grow-0"
              : "flex flex-grow-0"
          }
        >
          <NavbarBrand className="gap-5">
            <Link href="/" className="gap-2 flex">
              <p className="font-black text-xl text-white tracking-wider bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                FitUp
              </p>
            </Link>

            <div className="hidden sm:flex gap-5">
              {navigationProperties.map((item) => (
                <NavbarItem
                  key={`desktop-${item.href}`}
                  isActive={pathname === item.href}
                >
                  <Link
                    href={item.href}
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

        <NavbarContent className="sm:hidden" justify="start"></NavbarContent>
        {status === "authenticated" && pathname === `/${lng}/dashboard` && (
          <NavbarContent justify="end" className="h-20 sm:flex hidden">
            <InputSearchBar />
          </NavbarContent>
        )}

        <NavbarContent justify="end" className="flex-grow-0 gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            {LanguagePicker()}
            {showSession()}

            {status !== "authenticated" && (
              <Button
                as={Link}
                href="/signup"
                color="primary"
                size="sm"
                className="hidden sm:flex font-medium"
              >
                {t("signUp")}
              </Button>
            )}
          </div>
        </NavbarContent>
      </Navbar>
      {status === "authenticated" && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/70 backdrop-blur-lg border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
          <div className="flex flex-row  items-center h-16">
            {pathname === `/${lng}/dashboard` && (
              <Link
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${"text-zinc-400 hover:text-zinc-200"} cursor-pointer`}
                onPress={onOpen}
              >
                <FaPlus className="text-lg" />
                <span className="text-[10px] font-medium tracking-wide">
                  {t("add")}
                </span>
              </Link>
            )}

            <Link
              href={`/${lng}/dashboard`}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                pathname === `/${lng}/dashboard`
                  ? "text-primary"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FaChartArea className="text-lg" />
              <span className="text-[10px] font-medium tracking-wide">
                {t("dashboard")}
              </span>
            </Link>

            <Link
              href={`/${lng}/profile`}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                pathname === `/${lng}/profile`
                  ? "text-primary"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FaUserAlt className="text-lg" />
              <span className="text-[10px] font-medium tracking-wide">
                {t("profile")}
              </span>
            </Link>

            <Link
              className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors cursor-pointer text-red-400 hover:text-red-500"
              onPress={() =>
                signOut({ redirect: false }).then(() => router.push("/"))
              }
            >
              <FaSignOutAlt className="text-lg" />
              <span className="text-[10px] font-medium tracking-wide">
                {t("logout")}
              </span>
            </Link>
          </div>
        </div>
      )}

      {status === "unauthenticated" && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/70 backdrop-blur-lg border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
          <div className="flex flex-row items-center h-16">
            <Link
              href="/"
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                pathname === "/"
                  ? "text-primary"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FaHome className="text-lg" />
              <span className="text-[10px] font-medium tracking-wide">
                Home
              </span>
            </Link>

            <Link
              href="/login"
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                pathname === "/login"
                  ? "text-primary"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FaSignInAlt className="text-lg" />
              <span className="text-[10px] font-medium tracking-wide">
                {t("signIn")}
              </span>
            </Link>

            <Link
              href="/signup"
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                pathname === "/signup"
                  ? "text-primary"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FaUserPlus className="text-lg" />
              <span className="text-[10px] font-medium tracking-wide">
                {t("signUp")}
              </span>
            </Link>
          </div>
        </div>
      )}
      <ModalFindFood isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default NavbarComponent;
