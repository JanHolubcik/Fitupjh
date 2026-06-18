import { CardUniversal } from "@/components/common";
import { authClient } from "@/lib/auth-client";
import {
  CardHeader,
  Divider,
  CardBody,
  Button,
  Spinner,
  Input,
} from "@nextui-org/react";
import { Formik, Form } from "formik";
import { useT } from "next-i18next/client";
import { toast } from "react-toastify";

type User = typeof authClient.$Infer.Session.user;

export const ChangeEmail = ({ user }: { user: User }) => {
  const { t } = useT("profile");
  return (
    <CardUniversal className="shadow-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-2 pt-6 px-6 flex flex-col items-start gap-1">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          {t("changeEmail") || "Change Email"}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {t("changeEmailDesc")}
        </p>
      </CardHeader>
      <Divider className="bg-zinc-200 dark:bg-zinc-800" />
      <Formik
        enableReinitialize
        initialValues={{ currentEmail: user?.email || "", newEmail: "" }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          if (!values.newEmail || values.newEmail === user?.email) {
            setSubmitting(false);
            return;
          }

          const res = authClient.changeEmail({
            newEmail: values.newEmail,
            callbackURL: "/",
          });

          await toast.promise(
            res,
            {
              pending: t("toast.emailPending", "Changing email..."),
              success: t("toast.emailSuccess", "Email change requested! Please check your inbox."),
              error: {
                render({ data }: any) {
                  return data?.message || t("toast.error", "Failed to change email.");
                },
              },
            },
            { position: "bottom-left", theme: "dark", autoClose: 3000 },
          );

          resetForm({
            values: { currentEmail: user?.email || "", newEmail: "" },
          });
          setSubmitting(false);
        }}
      >
        {({ values, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <CardBody className="px-6 py-6 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  name="currentEmail"
                  label={t("currentEmail") || "Current Email"}
                  size="sm"
                  type="email"
                  value={values.currentEmail}
                  disabled
                  variant="faded"
                />
                <Input
                  name="newEmail"
                  label={t("newEmail") || "New Email"}
                  size="sm"
                  type="email"
                  value={values.newEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant="faded"
                  isDisabled={isSubmitting}
                  required
                />
              </div>
              <div className="flex sm:justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="w-full sm:w-fit bg-primary font-bold"
                >
                  {isSubmitting ? (
                    <Spinner size="sm" color="current" />
                  ) : (
                    t("updateEmail") || "Update Email"
                  )}
                </Button>
              </div>
            </CardBody>
          </Form>
        )}
      </Formik>
    </CardUniversal>
  );
};
