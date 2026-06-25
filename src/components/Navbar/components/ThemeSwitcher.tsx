"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { FaSun, FaMoon } from "react-icons/fa";

function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      isIconOnly
      variant="light"
      aria-label="Toggle theme"
      className="text-zinc-500 dark:text-zinc-400"
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
    </Button>
  );
}

export default ThemeSwitcher;
