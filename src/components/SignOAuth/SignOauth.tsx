import { authClient } from "@/lib/auth-client";
import { ButtonGroup, Button } from "@heroui/react";

import { FaGoogle, FaDiscord, FaGithub } from "react-icons/fa";

export default function SignOAuth({ disabled }: { disabled?: boolean }) {
  const handleDiscordLogin = async () => {
    await authClient.signIn.social({
      provider: "discord",
      callbackURL: "/dashboard",
    });
  };
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };
  const handleGithubLogin = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  };
  return (
    <ButtonGroup className="w-64 self-center">
      <Button
        isDisabled={disabled}
        onPress={handleGoogleLogin}
        className="w-full mt-4 font-bold text-lg  bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        <FaGoogle size={22} className="text-[#DB4437]" />
      </Button>
      <Button
        isDisabled={disabled}
        className="w-full mt-4 font-bold text-lg bg-[#5865F2] text-white hover:bg-[#4752C4]"
        onPress={handleDiscordLogin}
      >
        <FaDiscord size={24} />
      </Button>

      <Button
        isDisabled={disabled}
        onPress={handleGithubLogin}
        className="w-full mt-4 font-bold text-lg  bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        <FaGithub size={24} />
      </Button>
    </ButtonGroup>
  );
}
