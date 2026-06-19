import { usePathname, useRouter } from "next/navigation";
import { DropdownItem, Button } from "@heroui/react"; // Assuming NextUI based on your classNames
import Image from "next/image";

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const router = useRouter();

  const supportedLngs = ["en", "sk"];

  // Extract the current locale from the URL to highlight the active flag
  const currentLocale = pathname.split("/")[1];

  const switchLocale = (locale: string) => {
    // Prevent routing if the user clicks the language they are already using
    if (locale === currentLocale) return;

    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
  };

  return (
    <DropdownItem
      key="langs"
      className="hover:bg-transparent hover:cursor-pointer"
      textValue="Language Switcher"
    >
      <div className="flex flex-row gap-2 border-none">
        {supportedLngs.map((lng) => {
          const isActive = lng === currentLocale;

          return (
            <Button
              className={`m-0 p-0 min-w-10 max-h-7 transition-opacity ${
                isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
              }`}
              key={lng}
              onPress={() => switchLocale(lng)}
              aria-label={`Switch to ${lng}`}
            >
              <Image
                className="rounded-none object-cover"
                width={50}
                height={35}
                alt={`${lng} flag`}
                src={`../flags/${lng}.svg`}
              />
            </Button>
          );
        })}
      </div>
    </DropdownItem>
  );
};

export default LanguageSwitcher;

