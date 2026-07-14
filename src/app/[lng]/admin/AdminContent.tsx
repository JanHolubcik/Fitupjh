"use client";

import React, { useState, useEffect } from "react";
import { useT } from "next-i18next/client";
import {
  Input,
  Button,
  CardBody,
  Spinner,
  Divider,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Pagination,
} from "@heroui/react";
import { CardUniversal } from "@/components/common";
import {
  FaUserShield,
  FaUser,
  FaSearch,
  FaCalendarAlt,
  FaEnvelope,
  FaEdit,
  FaWeight,
  FaRuler,
  FaBullseye,
  FaRunning,
  FaTrash,
} from "react-icons/fa";
import { Formik, Form } from "formik";
import { showToast } from "@/utils/toast";
import { ApiResponse } from "@/lib/api-response";
import { AdminUser } from "@/lib/mongo/admin-db";

type AdminContentProps = {
  lng: string;
};

export const AdminContent = ({ lng }: AdminContentProps) => {
  const { t } = useT("admin");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/users?query=${encodeURIComponent(searchQuery)}&role=${roleFilter}&page=${page}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const resData = (await response.json()) as ApiResponse<{ users: AdminUser[]; total: number }>;
      const fetchedData = resData.data;
      if (fetchedData) {
        setUsers(fetchedData.users || []);
        setTotalPages(Math.ceil(fetchedData.total / limit) || 1);
      } else {
        setUsers([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error(error);
      showToast.error(t("toasts.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, roleFilter, page]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  const handleRoleFilterChange = (val: string) => {
    setRoleFilter(val);
    setPage(1);
  };

  const handleEditClick = (user: AdminUser) => {
    setSelectedUser(user);
    setIsRoleOpen(false);
    onOpen();
  };

  const handleDeleteClick = (user: AdminUser) => {
    setUserToDelete(user);
    onDeleteOpen();
  };

  const handleDeleteSubmit = async () => {
    if (!userToDelete) return;
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/admin/users?userId=${userToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      showToast.success(t("toasts.deleteSuccess"));
      onDeleteClose();
      fetchUsers();
    } catch (error) {
      console.error(error);
      showToast.error(t("toasts.deleteError"));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdateSubmit = async (
    values: { name: string; email: string; role: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    if (!selectedUser) return;

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          name: values.name,
          email: values.email,
          role: values.role,
        }),
      });

      const resData = (await response.json()) as ApiResponse<{ success: boolean }>;

      if (!response.ok) {
        if (response.status === 409 || resData.error === "email_conflict") {
          showToast.error(t("editModal.emailInvalid") + " (already exists)");
          setSubmitting(false);
          return;
        }
        throw new Error(resData.error || "Failed to update user");
      }

      showToast.success(t("toasts.updateSuccess"));
      onClose();
      fetchUsers();
    } catch (error) {
      console.error(error);
      showToast.error(t("toasts.updateError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-start sm:p-6 p-4 relative overflow-hidden bg-background text-foreground transition-colors duration-200 pt-10 sm:pt-16">
      <CardUniversal className="max-w-[900px] w-full p-6 sm:p-8 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <FaUserShield className="text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">{t("title")}</h1>
              <p className="text-xs text-default-500">{t("subtitle")}</p>
            </div>
          </div>
        </div>

        <Divider className="bg-zinc-200 dark:bg-zinc-800" />

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t("searchPlaceholder")}
              variant="faded"
              startContent={<FaSearch className="text-default-400" />}
              isClearable
              onClear={() => handleSearchChange("")}
            />
          </div>
          <div>
            <Select
              selectedKeys={new Set([roleFilter])}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                handleRoleFilterChange(selected || "all");
              }}
              variant="faded"
              aria-label={t("roleFilterLabel")}
            >
              <SelectItem key="all">{t("roleFilterAll")}</SelectItem>
              <SelectItem key="user">{t("roleFilterUser")}</SelectItem>
              <SelectItem key="admin">{t("roleFilterAdmin")}</SelectItem>
            </Select>
          </div>
        </div>

        {/* Users List */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Spinner size="lg" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 text-default-400 text-sm">
              {t("noUsersFound")}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map((user) => (
                  <CardUniversal
                    key={user.id}
                    className="transition-all duration-200"
                  >
                  <CardBody className="p-5 flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-extrabold text-base text-foreground truncate max-w-[180px]">
                          {user.name}
                        </h3>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={user.role === "admin" ? "primary" : "default"}
                          startContent={user.role === "admin" ? <FaUserShield className="text-[10px] mr-1" /> : <FaUser className="text-[10px] mr-1" />}
                          className="font-bold uppercase text-[10px] tracking-wide"
                        >
                          {user.role}
                        </Chip>
                      </div>

                      <div className="flex flex-col gap-1.5 text-xs text-default-500">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-default-400 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        {user.createdAt && (
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-default-400 shrink-0" />
                            <span>
                              {new Date(user.createdAt).toLocaleDateString(lng === "sk" ? "sk-SK" : "en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Read-only User Metrics Context */}
                      {(user.weight || user.height || user.goal || user.activityLevel) && (
                        <div className="mt-3 pt-3 border-t border-zinc-200/50 dark:border-white/5 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] text-default-400">
                          {user.goal && (
                            <div className="flex items-center gap-1.5">
                              <FaBullseye className="text-primary shrink-0" />
                              <span className="truncate font-medium">{user.goal}</span>
                            </div>
                          )}
                          {user.activityLevel && (
                            <div className="flex items-center gap-1.5">
                              <FaRunning className="text-primary shrink-0" />
                              <span className="truncate font-medium">{user.activityLevel}</span>
                            </div>
                          )}
                          {user.weight && (
                            <div className="flex items-center gap-1.5">
                              <FaWeight className="text-primary shrink-0" />
                              <span>{user.weight} kg</span>
                            </div>
                          )}
                          {user.height && (
                            <div className="flex items-center gap-1.5">
                              <FaRuler className="text-primary shrink-0" />
                              <span>{user.height} cm</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 w-full">
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="font-bold flex-1"
                        startContent={<FaEdit />}
                        onPress={() => handleEditClick(user)}
                      >
                        {t("table.edit")}
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        className="font-bold flex-1"
                        startContent={<FaTrash />}
                        onPress={() => handleDeleteClick(user)}
                      >
                        {t("table.delete")}
                      </Button>
                    </div>
                  </CardBody>
                </CardUniversal>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              total={totalPages}
              page={page}
              onChange={(newPage) => setPage(newPage)}
              color="primary"
              variant="flat"
            />
          </div>
        )}
      </CardUniversal>

      {/* Edit User Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" placement="center">
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
              onSubmit={handleUpdateSubmit}
            >
              {({ values, handleChange, handleBlur, isSubmitting, errors, touched, setFieldValue }) => (
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
                          {values.role === "admin" ? t("roleFilterAdmin") : t("roleFilterUser")}
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
                              transform: isRoleOpen ? "rotate(180deg)" : "rotate(0deg)",
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

      {/* Delete User Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange} backdrop="blur" placement="center">
        <ModalContent>
          {(modalClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-danger font-bold">
                {t("deleteModal.title")}
              </ModalHeader>
              <ModalBody>
                <p className="text-sm">
                  {t("deleteModal.confirmText", { name: userToDelete?.name })}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={modalClose}
                  isDisabled={deleteLoading}
                >
                  {t("deleteModal.cancelBtn")}
                </Button>
                <Button
                  color="danger"
                  className="font-bold"
                  isLoading={deleteLoading}
                  onPress={handleDeleteSubmit}
                >
                  {t("deleteModal.confirmBtn")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
};
