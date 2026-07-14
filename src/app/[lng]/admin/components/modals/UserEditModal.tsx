"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { Formik, Form } from "formik";
import { AdminUser } from "@/lib/mongo/admin-db";

type UserEditModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  selectedUser: AdminUser | null;
  onSubmit: (values: any, helpers: any) => Promise<void>;
  isRoleOpen: boolean;
  setIsRoleOpen: (open: boolean) => void;
  t: (key: string) => string;
};

export const UserEditModal = ({
  isOpen,
  onOpenChange,
  onClose,
  selectedUser,
  onSubmit,
  isRoleOpen,
  setIsRoleOpen,
  t,
}: UserEditModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      placement="center"
      classNames={{
        base: "overflow-visible",
        body: "overflow-visible",
      }}
    >
      <ModalContent>
        {(modalClose) => (
          <Formik
            initialValues={{
              name: selectedUser?.name || "",
              email: selectedUser?.email || "",
              role: selectedUser?.role || "user",
            }}
            validate={(values) => {
              const errors: Record<string, string> = {};
              if (!values.name.trim()) {
                errors.name = t("editModal.nameRequired");
              }
              if (!values.email.trim()) {
                errors.email = t("editModal.emailRequired");
              } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                errors.email = t("editModal.emailInvalid");
              }
              return errors;
            }}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({
              values,
              handleChange,
              handleBlur,
              isSubmitting,
              errors,
              touched,
              setFieldValue,
            }) => (
              <Form className="w-full">
                <ModalHeader className="flex flex-col gap-1">
                  {t("editModal.title")}
                </ModalHeader>
                <ModalBody className="flex flex-col gap-4">
                  <Input
                    name="name"
                    label={t("editModal.nameLabel")}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="faded"
                    isDisabled={isSubmitting}
                    isInvalid={touched.name && !!errors.name}
                    errorMessage={touched.name && errors.name}
                  />

                  <Input
                    name="email"
                    label={t("editModal.emailLabel")}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="faded"
                    isDisabled={isSubmitting}
                    isInvalid={touched.email && !!errors.email}
                    errorMessage={touched.email && errors.email}
                  />

                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setIsRoleOpen(!isRoleOpen)}
                      className={`w-full flex flex-col justify-center px-3 py-1.5 min-h-[56px] rounded-xl border-2 transition-colors duration-150 bg-transparent text-left relative focus:outline-none ${
                        isRoleOpen
                          ? "border-zinc-500 dark:border-zinc-400"
                          : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
                      }`}
                    >
                      <span className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 select-none mb-0.5">
                        {t("editModal.roleLabel")}
                      </span>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {values.role === "admin"
                          ? t("roleFilterAdmin")
                          : t("roleFilterUser")}
                      </span>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="w-4 h-4 transition-transform duration-200"
                          style={{
                            transform: isRoleOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </div>
                    </button>

                    {isRoleOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40 cursor-default"
                          onClick={() => setIsRoleOpen(false)}
                        />
                        <div className="absolute left-0 right-0 mt-2 z-50 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl max-h-60 overflow-y-auto py-1 animate-appearance-in">
                          <button
                            type="button"
                            onClick={() => {
                              setFieldValue("role", "user");
                              setIsRoleOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                              values.role === "user"
                                ? "bg-blue-600 text-white"
                                : "text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }`}
                          >
                            {t("roleFilterUser")}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFieldValue("role", "admin");
                              setIsRoleOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                              values.role === "admin"
                                ? "bg-blue-600 text-white"
                                : "text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }`}
                          >
                            {t("roleFilterAdmin")}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={modalClose}
                    isDisabled={isSubmitting}
                  >
                    {t("editModal.cancel")}
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    className="font-bold"
                    isLoading={isSubmitting}
                  >
                    {t("editModal.save")}
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        )}
      </ModalContent>
    </Modal>
  );
};
