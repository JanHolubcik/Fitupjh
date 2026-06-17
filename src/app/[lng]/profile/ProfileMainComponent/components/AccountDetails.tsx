"use client";

import React, { useRef } from "react";
import {
  Avatar,
  Button,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Spinner,
} from "@nextui-org/react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { useT } from "next-i18next/client";
import { CardUniversal } from "@/components/common";
import { useRouter } from "next/navigation";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
type User = typeof authClient.$Infer.Session.user;

export default function AccountDetails({ user }: { user: User }) {
  const router = useRouter();
  const { t } = useT("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAccountSubmit = async (values: {
    name: string;
    image: string;
  }) => {
    const res = authClient.updateUser({
      name: values.name,
      image: values.image,
    });

    await toast.promise(
      res,
      {
        pending: "Updating profile...",
        success: "Profile updated successfully!",
        error: {
          render({ data }: any) {
            return data?.message || "Failed to update.";
          },
        },
      },
      { theme: "dark", position: "bottom-left", autoClose: 3000 },
    );
    router.refresh();
  };

  return (
    <CardUniversal className="shadow-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-2 pt-6 px-6 flex flex-col items-start gap-1">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          {t("accountDetails")}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {t("accountDetailsDesc")}
        </p>
      </CardHeader>
      <Divider className="bg-zinc-200 dark:bg-zinc-800" />

      <Formik
        enableReinitialize
        initialValues={{ name: user?.name || "", image: user?.image || "" }}
        onSubmit={async (values, { setSubmitting }) => {
          await handleAccountSubmit(values);
          setSubmitting(false);
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          isSubmitting,
          setFieldValue,
        }) => (
          <Form>
            <CardBody className="px-6 py-6 flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex flex-col items-center gap-3 shrink-0 mx-auto sm:mx-0">
                <Avatar src={values.image} className="w-20 h-20 text-large" />
                <Button
                  size="sm"
                  variant="flat"
                  className="font-medium"
                  onPress={() => !isSubmitting && fileInputRef.current?.click()}
                >
                  Change Picture
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const base64 = await fileToBase64(file);
                        setFieldValue("image", base64);
                      } catch (err) {
                        toast.error("Failed to process image");
                      }
                    }
                  }}
                />
              </div>

              <div className="flex flex-col gap-4 w-full">
                <Input
                  name="name"
                  label={t("displayName") || "Display Name"}
                  size="sm"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant="faded"
                  isDisabled={isSubmitting}
                  required
                />
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
                      t("saveChanges") || "Save Changes"
                    )}
                  </Button>
                </div>
              </div>
            </CardBody>
          </Form>
        )}
      </Formik>
    </CardUniversal>
  );
}
