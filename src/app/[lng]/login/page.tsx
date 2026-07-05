"use client";

import { useRouter, useParams } from "next/navigation";
import NextLink from "next/link";
import { Link, Input, Spinner, CardHeader, CardBody } from "@heroui/react";

import PulsingButton from "@/components/PulsingButton/PulsingButton";
import { useT } from "next-i18next/client";
import { CardUniversal } from "@/components/common";
import { useFormik } from "formik";
import LanguagePicker from "@/components/Navbar/components/LanguagePicker";
import { authClient } from "@/lib/auth-client";
import SignOAuth from "@/components/SignOAuth/SignOauth";

const customInputStyles = {
  inputWrapper:
    "dark:bg-zinc-800/50 border-transparent transition-all duration-200 ring-1 ring-transparent focus-within:ring-[#00FFAA] focus-within:ring-2 shadow-md focus-within:shadow-[#00FFAA]/20 hover:bg-zinc-800",
  input: "text-white",
  label: "text-zinc-400 group-focus-within:text-[#00FFAA] transition-colors",
};

export default function Login() {
  const router = useRouter();
  const params = useParams();
  const lng = params?.lng || "en";
  const { t } = useT("login");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setStatus(null);

      const { data, error } = await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,

          callbackURL: "/dashboard",
        },
        {
          onRequest: (ctx) => {
            //show loading
          },
          onSuccess: (ctx) => {
            //redirect to the dashboard or sign in page
          },
          onError: (ctx) => {},
        },
      );

      if (error) {
        setStatus(t("invalidEmailPassword"));
        setSubmitting(false);
        return;
      }

      return router.push(`/${lng}/dashboard`);
    },
  });

  return (
    <main className=" flex flex-col items-center justify-center min-h-[calc(100vh-100px)] sm:p-10 p-6">
      <CardUniversal className="w-full max-w-[450px] p-4 font-semibold ">
        <CardHeader className="flex flex-col items-center justify-center pt-6 pb-2">
          <h1 className="text-3xl font-extrabold tracking-tight ">
            {t("title")}
          </h1>
          <p className="text-sm dark:text-zinc-400 mt-2">{t("subtitle")}</p>
        </CardHeader>

        <CardBody className="flex flex-col gap-4">
          <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
            <Input
              type="email"
              label={t("emailLabel")}
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              classNames={customInputStyles}
              isDisabled={formik.isSubmitting}
              required
            />

            <Input
              type="password"
              label={t("passwordLabel")}
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              classNames={customInputStyles}
              isDisabled={formik.isSubmitting}
              required
            />
            <div className="block sm:hidden">
              <LanguagePicker />
            </div>
            {formik.status && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-medium rounded-lg p-3 text-center">
                {formik.status}
              </div>
            )}

            <PulsingButton
              className="w-full mt-4 font-bold text-lg h-12 dark:text-white"
              type="submit"
              isDisabled={formik.isSubmitting}
              noPulsing
            >
              {formik.isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size="sm" color="current" />
                  <span>{t("signingIn")}</span>
                </div>
              ) : (
                t("signInButton")
              )}
            </PulsingButton>

            <div className="text-center mt-4">
              <span className="text-sm font-semibold dark:text-zinc-400">
                {t("noAccountText")}
              </span>
              <Link
                as={NextLink}
                href={`/${lng}/signup`}
                className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
              >
                {t("signUpLink")}
              </Link>
            </div>
          </form>
          <SignOAuth />
          <div className="text-center text-xs font-normal text-zinc-500 dark:text-zinc-400 mt-4 select-none">
            <span>{t("byContinuing")}</span>
            <Link
              as={NextLink}
              href={`/${lng}/terms-of-use`}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer inline-block"
            >
              {t("termsOfUseLinkText")}
            </Link>
            <span>{t("andText")}</span>
            <Link
              as={NextLink}
              href={`/${lng}/privacy-policy`}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer inline-block"
            >
              {t("privacyPolicyLinkText")}
            </Link>
            <span>{t("agreePeriod")}</span>
          </div>
        </CardBody>
      </CardUniversal>
    </main>
  );
}
