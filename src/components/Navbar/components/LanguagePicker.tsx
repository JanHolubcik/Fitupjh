"use client";

import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import Image from "next/image";
import { FaCaretDown } from "react-icons/fa";

const supportedLngs = [
  { code: "en", name: "English", flag: "/flags/en.svg" },
  { code: "sk", name: "Slovensky", flag: "/flags/sk.svg" },
];

const LanguagePicker = () => {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = pathname.split("/")[1] || "en";

  const selectedLanguage = useMemo(() => {
    return (
      supportedLngs.find((lang) => lang.code === currentLocale) ||
      supportedLngs[0]
    );
  }, [currentLocale]);

  const handleLanguageChange = (newLocale: string) => {
    if (!pathname) return;
    const pathParts = pathname.split("/");
    pathParts[1] = newLocale;
    const newPath = pathParts.join("/");
    router.push(newPath);
  };

  return (
    <Dropdown showArrow={true} className="border-none">
      <DropdownTrigger>
        <Button
          variant="light"
          size="sm"
          startContent={
            <Image
              src={selectedLanguage.flag}
              alt={selectedLanguage.name}
              width={20}
              height={15}
              className="rounded-sm object-cover"
            />
          }
          endContent={<FaCaretDown />}
        ></Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        onAction={(key) => handleLanguageChange(key as string)}
        selectedKeys={[currentLocale]}
        selectionMode="single"
      >
        {supportedLngs.map((lang) => (
          <DropdownItem
            key={lang.code}
            className="20px"
            startContent={
              <Image
                src={lang.flag}
                alt={lang.name}
                width={20}
                height={15}
                className="rounded-sm object-cover"
              />
            }
          >
            {lang.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguagePicker;

