"use client";

import { useRouter, useParams } from "next/navigation";
import { CardBody, CardHeader, Input, Link, Spinner } from "@nextui-org/react";
import PulsingButton from "@/components/PulsingButton/PulsingButton";
import { signupSchema } from "@/lib/validationShemas/signupValidationSchema";
import { useT } from "next-i18next/client";
import { CardUniversal } from "@/components/common";
import { useFormik } from "formik";

const customInputStyles = {
  inputWrapper:
    "dark:bg-zinc-800/50 border-transparent transition-all duration-200 ring-1 ring-transparent focus-within:ring-[#00FFAA] focus-within:ring-2 shadow-md focus-within:shadow-[#00FFAA]/20 hover:bg-zinc-800",
  input: "text-white",
  label:
    "dark:text-zinc-400 group-focus-within:text-[#00FFAA] transition-colors",
};

export default function Signup() {
  const router = useRouter();
  const params = useParams();
  const lng = params?.lng || "en";
  const { t } = useT("signup");

  const formik = useFormik({
    initialValues: {
      username: "",
      userEmail: "",
      password: "",
      height: "",
      weight: "",
    },

    validate: (values) => {
      const validationResult = signupSchema.safeParse(values);

      if (validationResult.success) return {};

      const errors: Record<string, string> = {};
      const fieldErrors = validationResult.error.flatten().fieldErrors;

      Object.entries(fieldErrors).forEach(([key, messages]) => {
        // 'messages' are automatically typed as string[] | undefined
        if (messages && messages.length > 0) {
          errors[key] = messages[0];
        }
      });

      return errors;
    },

    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setStatus(null);

      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (res.ok) {
          router.push(`/${lng}/login`);
        } else {
          setStatus(data.error || "Something went wrong during signup.");
          setSubmitting(false);
        }
      } catch (err) {
        setStatus("Network error. Please try again.");
        setSubmitting(false);
      }
    },
  });

  return (
    <main className="flex flex-col items-center justify-center min-h-screen sm:p-10 p-6">
      <CardUniversal className="w-full max-w-[450px] p-4  backdrop-blur-md border font-semibold">
        <CardHeader className="flex flex-col items-center justify-center pt-6 pb-2">
          <h1 className="text-3xl font-extrabold tracking-tight ">
            {t("title")}
          </h1>
          <p className="text-sm dark:text-zinc-400 mt-2">{t("subtitle")}</p>
        </CardHeader>

        <CardBody className="flex flex-col gap-4">
          <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
            <Input
              name="username"
              label={t("usernameLabel")}
              classNames={customInputStyles}
              type="text"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} // Important: Tracks if the user visited the field
              // Only show error if the user has touched the field AND it has an error
              isInvalid={formik.touched.username && !!formik.errors.username}
              errorMessage={formik.touched.username && formik.errors.username}
              isDisabled={formik.isSubmitting}
            />

            <Input
              name="userEmail"
              label={t("emailLabel")}
              classNames={customInputStyles}
              type="email"
              value={formik.values.userEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.userEmail && !!formik.errors.userEmail}
              errorMessage={formik.touched.userEmail && formik.errors.userEmail}
              isDisabled={formik.isSubmitting}
            />

            <Input
              name="password"
              label={t("passwordLabel")}
              classNames={customInputStyles}
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.password && !!formik.errors.password}
              errorMessage={formik.touched.password && formik.errors.password}
              isDisabled={formik.isSubmitting}
            />

            <div className="flex flex-row gap-4">
              <Input
                name="height"
                label={t("heightLabel")}
                classNames={customInputStyles}
                type="number"
                value={formik.values.height}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.height && !!formik.errors.height}
                errorMessage={formik.touched.height && formik.errors.height}
                isDisabled={formik.isSubmitting}
              />

              <Input
                name="weight"
                label={t("weightLabel")}
                classNames={customInputStyles}
                type="number"
                value={formik.values.weight}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.weight && !!formik.errors.weight}
                errorMessage={formik.touched.weight && formik.errors.weight}
                isDisabled={formik.isSubmitting}
              />
            </div>

            {formik.status && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-medium rounded-lg p-3 text-center">
                {formik.status}
              </div>
            )}

            <PulsingButton
              className="w-full mt-4 font-bold text-lg h-12"
              type="submit"
              disabled={formik.isSubmitting}
              noPulsing
            >
              {formik.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" color="current" />
                  <span>{t("creatingAccount")}</span>
                </div>
              ) : (
                t("signUpButton")
              )}
            </PulsingButton>

            <div className="text-center mt-4">
              <span className="text-sm dark:text-zinc-400">
                {t("hasAccountText")}
              </span>
              <Link
                href={`/${lng}/login`}
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                {t("logInLink")}
              </Link>
            </div>
          </form>
        </CardBody>
      </CardUniversal>
    </main>
  );
}
