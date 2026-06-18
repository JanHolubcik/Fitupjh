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

export const ChangePassword = () => {
  const { t } = useT("profile");

  const handlePasswordSubmit = async (values: any, resetForm: () => void) => {
    const res = authClient.changePassword({
      newPassword: values.newPassword,
      currentPassword: values.currentPassword,
      revokeOtherSessions: true,
    });
    await toast.promise(
      res,
      {
        pending: t("toast.passwordPending"),
        success: t("toast.passwordSuccess"),
        error: {
          render({ data }: any) {
            return data?.message || t("toast.error");
          },
        },
      },
      { theme: "dark", position: "bottom-left", autoClose: 3000 },
    );

    resetForm();
  };
  return (
    <CardUniversal className="shadow-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-2 pt-6 px-6 flex flex-col items-start gap-1">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          {t("changePassword") || "Change Password"}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {t("changePasswordDesc")}
        </p>
      </CardHeader>
      <Divider className="bg-zinc-200 dark:bg-zinc-800" />
      <Formik
        initialValues={{ currentPassword: "", newPassword: "" }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          await handlePasswordSubmit(values, resetForm);
          setSubmitting(false);
        }}
      >
        {({ values, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <CardBody className="px-6 py-6 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  name="currentPassword"
                  label={t("currentPassword") || "Current Password"}
                  size="sm"
                  type="password"
                  value={values.currentPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant="faded"
                  isDisabled={isSubmitting}
                  required
                />
                <Input
                  name="newPassword"
                  label={t("newPassword") || "New Password"}
                  size="sm"
                  type="password"
                  value={values.newPassword}
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
                    t("updatePassword") || "Update Password"
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
