"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import {
  Image,
  Card,
  CardBody,
  CardHeader,
  Input,
  Link,
  Tooltip,
  Spinner,
} from "@nextui-org/react";
import { FaInfoCircle } from "react-icons/fa";
import PulsingButton from "@/components/PulsingButton/PulsingButton";
import { signupSchema } from "@/lib/validationShemas/signupValidationSchema";
import { useT } from "next-i18next/client";

const customInputStyles = {
  inputWrapper:
    "bg-zinc-800/50 border-transparent transition-all duration-200 ring-1 ring-transparent focus-within:ring-[#00FFAA] focus-within:ring-2 shadow-md focus-within:shadow-[#00FFAA]/20 hover:bg-zinc-800",
  input: "text-white",
  label: "text-zinc-400 group-focus-within:text-[#00FFAA] transition-colors",
};

export default function Signup() {
  const router = useRouter();
  const params = useParams();
  const lng = params?.lng || "en";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const { t } = useT("signup");

  const InfoTooltip = () => (
    <Tooltip
      showArrow
      placement="top-end"
      content={
        <div className="p-2 max-w-64">
          <div className="flex justify-center mb-2">
            <Image
              className="object-contain"
              alt="Info"
              src="eplaining_owl.png"
              width={70}
              height={70}
            />
          </div>
          <h1 className="text-center font-bold mb-1 text-sm">
            {t("infoTooltipTitle")}
          </h1>
          <p className="text-center text-xs text-zinc-300">
            {t("infoTooltipText")}
          </p>
        </div>
      }
    >
      <button type="button" className="focus:outline-none" tabIndex={-1}>
        <FaInfoCircle className="text-zinc-500 hover:text-white transition-colors" />
      </button>
    </Tooltip>
  );

  const [formData, setFormData] = useState({
    username: "",
    userEmail: "",
    password: "",
    height: "",
    weight: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: [] });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const validationResult = signupSchema.safeParse(formData);

    if (!validationResult.success) {
      const mappedErrors = validationResult.error.flatten().fieldErrors;
      setFieldErrors(mappedErrors as Record<string, string[]>);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validationResult.data),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/${lng}/login`);
      } else {
        setError(data.error || "Something went wrong during signup.");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="dark flex flex-col items-center justify-center min-h-screen sm:p-10 p-6">
      <Card className="w-full max-w-[450px] p-4 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 shadow-2xl">
        <CardHeader className="flex flex-col items-center justify-center pt-6 pb-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            {t("title")}
          </h1>
          <p className="text-sm text-zinc-400 mt-2">
            {t("subtitle")}
          </p>
        </CardHeader>

        <CardBody className="flex flex-col gap-4">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              name="username"
              label={t("usernameLabel")}
              classNames={customInputStyles}
              type="text"
              value={formData.username}
              onChange={handleChange}
              isInvalid={!!fieldErrors.username}
              errorMessage={fieldErrors.username?.[0]}
              isDisabled={loading}
            />

            <Input
              name="userEmail"
              label={t("emailLabel")}
              classNames={customInputStyles}
              type="email"
              value={formData.userEmail}
              onChange={handleChange}
              isInvalid={!!fieldErrors.userEmail}
              errorMessage={fieldErrors.userEmail?.[0]}
              isDisabled={loading}
            />

            <Input
              name="password"
              label={t("passwordLabel")}
              classNames={customInputStyles}
              type="password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!fieldErrors.password}
              errorMessage={fieldErrors.password?.[0]}
              isDisabled={loading}
            />

            {/* Grouped Height and Weight in a row */}
            <div className="flex flex-row gap-4">
              <Input
                name="height"
                label={t("heightLabel")}
                classNames={customInputStyles}
                type="number"
                value={formData.height}
                onChange={handleChange}
                isInvalid={!!fieldErrors.height}
                errorMessage={fieldErrors.height?.[0]}
                endContent={<InfoTooltip />}
                isDisabled={loading}
              />

              <Input
                name="weight"
                label={t("weightLabel")}
                classNames={customInputStyles}
                type="number"
                value={formData.weight}
                onChange={handleChange}
                isInvalid={!!fieldErrors.weight}
                errorMessage={fieldErrors.weight?.[0]}
                endContent={<InfoTooltip />}
                isDisabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-medium rounded-lg p-3 text-center">
                {error}
              </div>
            )}

            <PulsingButton
              className="w-full mt-4 font-bold text-lg h-12"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" color="current" />
                  <span>{t("creatingAccount")}</span>
                </div>
              ) : (
                t("signUpButton")
              )}
            </PulsingButton>

            <div className="text-center mt-4">
              <span className="text-sm text-zinc-400">
                {t("hasAccountText")}
              </span>
              <Link
                href={`/${lng}/login`}
                className="text-sm font-semibold text-[#00FFAA] hover:text-[#00FFAA]/80 transition-colors"
              >
                {t("logInLink")}
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
