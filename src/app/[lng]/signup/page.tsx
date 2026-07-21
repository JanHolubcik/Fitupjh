"use client";

import { useParams, useRouter } from "next/navigation";
import NextLink from "next/link";
import {
  Button,
  CardBody,
  CardHeader,
  Input,
  Link,
  Spinner,
  Checkbox,
  Select,
  SelectItem,
} from "@heroui/react";

import { signupSchema } from "@/lib/validationShemas/signupValidationSchema";
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
  label:
    "dark:text-zinc-400 group-focus-within:text-[#00FFAA] transition-colors",
};

export default function Signup() {
  const params = useParams();
  const lng = params?.lng || "en";
  const { t } = useT("signup");

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: "",
      userEmail: "",
      password: "",
      height: "",
      weight: "",
      yearOfBirth: "",
      gender: "male",
      termsAccepted: false,
    },

    validate: (values) => {
      const validationResult = signupSchema.safeParse(values);

      if (validationResult.success) return {};

      const errors: Record<string, string> = {};
      const fieldErrors = validationResult.error.flatten().fieldErrors;

      Object.entries(fieldErrors).forEach(([key, messages]) => {
        // 'messages' are automatically typed as string[] | undefined
        if (messages && messages.length > 0) {
          errors[key] = t(messages[0]);
        }
      });

      return errors;
    },

    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setStatus(null);

      try {
        //await signupMutation.mutateAsync(values);

        const { data, error } = await authClient.signUp.email({
          email: values.userEmail,
          password: values.password,
          name: values.username,
          image: "",
          callbackURL: "/dashboard",
          weight: Number(values.weight),
          height: Number(values.height),
          yearOfBirth: Number(values.yearOfBirth),
          gender: values.gender,
          termsAccepted: values.termsAccepted,
        });

        if (error) {
          setStatus(error.message || t("errors.serverError"));
          setSubmitting(false);
          return;
        }
        router.refresh();
        router.push(`/${lng}/dashboard`);
      } catch (err) {
        setStatus(t("errors.serverError"));
        setSubmitting(false);
      }
    },
  });

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] sm:p-10 p-6">
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
              onBlur={formik.handleBlur}
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
                min={50}
                max={250}
                isInvalid={formik.touched.height && !!formik.errors.height}
                errorMessage={formik.touched.height && formik.errors.height}
                isDisabled={formik.isSubmitting}
              />

              <Input
                name="weight"
                label={t("weightLabel")}
                classNames={customInputStyles}
                type="number"
                min={50}
                max={200}
                value={formik.values.weight}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.weight && !!formik.errors.weight}
                errorMessage={formik.touched.weight && formik.errors.weight}
                isDisabled={formik.isSubmitting}
              />
            </div>

            <div className="flex flex-row gap-4">
              <Input
                name="yearOfBirth"
                label={t("yearOfBirthLabel")}
                classNames={customInputStyles}
                type="number"
                min={1900}
                max={new Date().getFullYear()}
                value={formik.values.yearOfBirth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.yearOfBirth && !!formik.errors.yearOfBirth}
                errorMessage={formik.touched.yearOfBirth && formik.errors.yearOfBirth}
                isDisabled={formik.isSubmitting}
              />

              <Select
                name="gender"
                label={t("genderLabel")}
                selectedKeys={[formik.values.gender]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant="faded"
                isDisabled={formik.isSubmitting}
                isInvalid={formik.touched.gender && !!formik.errors.gender}
                errorMessage={formik.touched.gender && formik.errors.gender}
                className="w-full"
              >
                <SelectItem key="male">{t("genderMale")}</SelectItem>
                <SelectItem key="female">{t("genderFemale")}</SelectItem>
              </Select>
            </div>

            <div className="block sm:hidden">
              <LanguagePicker />
            </div>

            {formik.status && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-medium rounded-lg p-3 text-center">
                {formik.status}
              </div>
            )}

            <Checkbox
              isSelected={formik.values.termsAccepted}
              onValueChange={(isSelected) =>
                formik.setFieldValue("termsAccepted", isSelected)
              }
              className="w-full"
              classNames={{
                label:
                  "text-xs font-normal text-zinc-500 dark:text-zinc-400 select-none",
              }}
            >
              <span>{t("agreeText")}</span>
              <Link
                as={NextLink}
                href={`/${lng}/terms-of-use`}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer  inline-block"
              >
                {t("termsOfUseLinkText")}
              </Link>
              <span className="">{t("andText")}</span>
              <Link
                as={NextLink}
                href={`/${lng}/privacy-policy`}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer inline-block"
              >
                {t("privacyPolicyLinkText")}
              </Link>
              <span>{t("agreePeriod")}</span>
            </Checkbox>

            <Button
              className="w-full mt-4 font-bold text-lg h-12"
              type="submit"
              color="primary"
              isDisabled={formik.isSubmitting || !formik.values.termsAccepted}
            >
              {formik.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" color="current" />
                  <span>{t("creatingAccount")}</span>
                </div>
              ) : (
                t("signUpButton")
              )}
            </Button>

            <div className="text-center mt-4">
              <span className="text-sm dark:text-zinc-400">
                {t("hasAccountText")}
              </span>
              <Link
                as={NextLink}
                href={`/${lng}/login`}
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                {t("logInLink")}
              </Link>
              <SignOAuth disabled={!formik.values.termsAccepted} />
            </div>
          </form>
        </CardBody>
      </CardUniversal>
    </main>
  );
}
