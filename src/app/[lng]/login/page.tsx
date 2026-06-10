"use client";

import { FormEvent, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Link,
  Input,
  Spinner,
  Card,
  CardHeader,
  CardBody,
} from "@nextui-org/react";
import { signIn } from "next-auth/react";
import PulsingButton from "@/components/PulsingButton/PulsingButton";
import { useT } from "next-i18next/client";

const customInputStyles = {
  inputWrapper:
    "bg-zinc-800/50 border-transparent transition-all duration-200 ring-1 ring-transparent focus-within:ring-[#00FFAA] focus-within:ring-2 shadow-md focus-within:shadow-[#00FFAA]/20 hover:bg-zinc-800",
  input: "text-white",
  label: "text-zinc-400 group-focus-within:text-[#00FFAA] transition-colors",
};

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const lng = params?.lng || "en";
  const [loading, setLoading] = useState(false);
  const { t } = useT("login");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    // next auth logging to session
    setLoading(true);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      setError(res.error as string);
    }

    if (res?.ok) {
      return router.push(`/${lng}/dashboard`);
    }
  };

  return (
    <main className="dark flex flex-col items-center justify-center min-h-screen sm:p-10 p-6">
      <Card className="w-full max-w-[450px] p-4 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 shadow-2xl">
        <CardHeader className="flex flex-col items-center justify-center pt-6 pb-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            {t("title")}
          </h1>
          <p className="text-sm text-zinc-400 mt-2">{t("subtitle")}</p>
        </CardHeader>

        <CardBody className="flex flex-col gap-4">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              type="email"
              label={t("emailLabel")}
              name="email"
              classNames={customInputStyles}
              isDisabled={loading}
              required
            />

            <Input
              type="password"
              label={t("passwordLabel")}
              name="password"
              classNames={customInputStyles}
              isDisabled={loading}
              required
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-medium rounded-lg p-3 text-center">
                {error}
              </div>
            )}

            <PulsingButton
              className="w-full mt-4 font-bold text-lg h-12"
              type="submit"
              disabled={loading}
              noPulsing
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size="sm" color="current" />
                  <span>{t("signingIn")}</span>
                </div>
              ) : (
                t("signInButton")
              )}
            </PulsingButton>

            <div className="text-center mt-4">
              <span className="text-sm text-zinc-400">
                {t("noAccountText")}
              </span>
              <Link
                href={`/${lng}/signup`}
                className="text-sm font-semibold text-[#00FFAA] hover:text-[#00FFAA]/80 transition-colors"
              >
                {t("signUpLink")}
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
