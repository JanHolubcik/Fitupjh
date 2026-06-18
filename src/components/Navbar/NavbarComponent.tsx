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

import { useParams, usePathname, useRouter } from "next/navigation";
import { InputSearchBar } from "../InputSearchBar/InputSearchBar";
import { LanguagePicker } from "./components/LanguagePicker";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { useT } from "next-i18next/client";
import {
  FaChartArea,
  FaSignOutAlt,
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaPlus,
  FaSearch,
  FaCameraRetro,
} from "react-icons/fa";
import { ModalFindFood } from "../Findfood/components/ModalFindFood";
import { authClient } from "@/lib/auth-client";
import { AuthSessionData } from "@/lib/auth";
import { ModalScanFood } from "../Findfood/components/ModalScanFood";
import { getTimeOfDay } from "@/app/[lng]/constants/FunctionsHelper";

const NavbarComponent = ({ data }: { data: AuthSessionData }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenBarScan,
    onOpen: onOpenBarScan,
    onClose: onCloseBarScan,
    onOpenChange: onOpenChangeBarScan,
  } = useDisclosure();
  const pathname = usePathname();
  const { t } = useT("navbar");
  const router = useRouter();

  const params = useParams();
  const lng = params?.lng || "en";

  const navigationProperties = [
    ...(data
      ? [
          { id: 1, href: `/${lng}/dashboard`, description: t("dashboard") },
          { id: 2, href: `/${lng}/profile`, description: t("profile") },
        ]
      : []),
  ];

  const signOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
          router.push("/login");
        },
      },
    });
  };

  const showSession = () => {
    if (data) {
      return (
        <Dropdown className="hidden sm:block" placement="bottom-end">
          <DropdownTrigger className="hidden sm:block">
            <Button
              variant="light"
              size="md"
              className="text-zinc-800 dark:text-zinc-200 font-medium min-w-min px-0 sm:px-2"
            >
              <Avatar
                key={data?.user?.image}
                isBordered
                color="primary"
                size="sm"
                src={data?.user?.image || ""}
                className="cursor-pointer transition-transform hover:scale-105 shrink-0"
              />
            </Button>
          </DropdownTrigger>

          <DropdownMenu variant="faded" aria-label="User menu actions">
            <DropdownItem
              key="name"
              isReadOnly
              className="cursor-default gap-2 border-none data-[hover=true]:bg-transparent  "
            >
              <p>{data.user?.name}</p>
            </DropdownItem>

            <DropdownItem
              key="logout"
              className="text-danger"
              color="danger"
              onPress={signOut}
            >
              {t("logout")}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
    }

    return (
      <Link
        href={`/${lng}/login`}
        size="sm"
        className="hidden sm:flex font-medium border-2 text-xs  dark:text-white border-zinc-600 rounded-lg p-[6px]"
      >
        {t("signIn")}
      </Link>
    );
  };

  return (
    <>
      <Navbar
        isBordered
        className=" sm:flex hidden shadow-lg bg-default-50/50 border-black/10 dark:border-white/10 sm:bg-white/70 sm:dark:bg-zinc-950/70 sm:border-black/5 sm:dark:border-white/5 backdrop-blur-md"
        maxWidth="xl"
      >
        <NavbarContent
          justify="start"
          className={data ? "hidden sm:flex flex-grow-0" : "flex flex-grow-0"}
        >
          <NavbarBrand className="gap-5">
            <Link href="/" className="gap-2 flex">
              <p className="font-black text-xl text-black dark:text-white tracking-wider bg-gradient-to-r from-black dark:from-white to-zinc-600 dark:to-zinc-400 bg-clip-text text-transparent">
                FitUp
              </p>
            </Link>

            <div className="hidden sm:flex gap-5">
              {navigationProperties.map((item) => (
                <NavbarItem
                  id={item.id === 2 ? "tour-profile-desktop" : ""}
                  key={`desktop-${item.href}`}
                  isActive={pathname === item.href}
                >
                  <Link
                    href={item.href}
                    className={`text-[15px] font-extrabold dark:font-bold transition-colors ${
                      pathname === item.href
                        ? "text-primary"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
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
        {data && pathname === `/${lng}/dashboard` && (
          <NavbarContent justify="end" className="h-20 sm:flex hidden">
            <InputSearchBar />
          </NavbarContent>
        )}

        <NavbarContent justify="end" className="flex-grow-0 gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <LanguagePicker />
            <ThemeSwitcher />
            {showSession()}

            {!data && (
              <Link
                as={Link}
                href={`/${lng}/signup`}
                color="primary"
                size="sm"
                className="hidden sm:flex bg-primary font-medium  text-xs text-white  rounded-lg w-22 p-[7px]"
              >
                {t("signUp")}
              </Link>
            )}
          </div>
        </NavbarContent>
      </Navbar>
      {data && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-lg border-t border-black/10 dark:border-white/10 pb-[env(safe-area-inset-bottom)]">
          <div className="flex flex-row  items-center h-16">
            {pathname === `/${lng}/dashboard` && (
              <Dropdown
                placement="top"
                className="dark:bg-zinc-900 bg-white min-w-[220px] shadow-xl border border-zinc-200/50 dark:border-zinc-800/50"
              >
                <DropdownTrigger>
                  <Link
                    as="button"
                    id="tour-search-bar-mobile"
                    className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200 cursor-pointer outline-none"
                  >
                    <FaPlus className="text-lg" />
                    <span className="text-[10px] font-medium tracking-wide">
                      {t("add")}
                    </span>
                  </Link>
                </DropdownTrigger>

                <DropdownMenu
                  aria-label="Add options"
                  itemClasses={{
                    base: "py-3.5 px-4 rounded-xl data-[hover=true]:bg-zinc-100 dark:data-[hover=true]:bg-zinc-800",
                    title:
                      "text-[15px] font-semibold text-zinc-800 dark:text-zinc-200",
                  }}
                >
                  <DropdownItem
                    startContent={
                      <FaSearch className="text-xl text-zinc-500 dark:text-zinc-400" />
                    }
                    key="action1"
                    onPress={onOpen}
                  >
                    {t("findFood")}
                  </DropdownItem>
                  <DropdownItem
                    onPress={onOpenBarScan}
                    key="action2"
                    startContent={
                      <FaCameraRetro className="text-xl text-zinc-500 dark:text-zinc-400" />
                    }
                  >
                    {t("photoOrScan")}
                  </DropdownItem>
                  <DropdownItem
                    key="action3"
                    className="text-danger"
                    color="danger"
                  >
                    {t("close")}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}

            <Link
              href={`/${lng}/dashboard`}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                pathname === `/${lng}/dashboard`
                  ? "text-primary"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200"
              }`}
            >
              <FaChartArea className="text-lg" />
              <span className="text-[10px] font-medium tracking-wide">
                {t("dashboard")}
              </span>
            </Link>

            <Link
              id="tour-profile-mobile"
              href={`/${lng}/profile`}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                pathname === `/${lng}/profile`
                  ? "text-primary"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200"
              }`}
            >
              <Avatar
                key={data?.user?.image}
                isBordered
                color={pathname === `/${lng}/profile` ? "primary" : "default"}
                size="sm"
                src={data?.user?.image || ""}
                className="cursor-pointer transition-transform hover:scale-105 shrink-0"
              />
              <span className="text-[10px] font-medium tracking-wide">
                {t("profile")}
              </span>
            </Link>

            <Link
              className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors cursor-pointer text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
              onPress={signOut}
            >
              <FaSignOutAlt className="text-lg" />
              <span className="text-[10px] font-medium tracking-wide">
                {t("logout")}
              </span>
            </Link>
          </div>
        </div>
      )}

      {!data && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-lg border-t border-black/10 dark:border-white/10 pb-[env(safe-area-inset-bottom)]">
          <div className="flex flex-row items-center h-16">
            <Link
              href="/"
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                pathname === "/"
                  ? "text-primary"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200"
              }`}
            >
              <FaHome className="text-lg" />
              <span className="text-[10px] font-medium tracking-wide">
                Home
              </span>
            </Link>

            <Link
              href={`/${lng}/login`}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                pathname === "/login"
                  ? "text-primary"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200"
              }`}
            >
              <FaSignInAlt className="text-lg" />
              <span className="text-[10px] font-medium tracking-wide">
                {t("signIn")}
              </span>
            </Link>

            <Link
              href={`/${lng}/signup`}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                pathname === "/signup"
                  ? "text-primary"
                  : "text-zinc-600  dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200"
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
      <ModalScanFood
        isOpen={isOpenBarScan}
        onOpenChange={onOpenChangeBarScan}
        onClose={onCloseBarScan}
        timeOfDay={getTimeOfDay()}
      />
    </>
  );
};

export default NavbarComponent;
