"use client";

import React from "react";
import { useT } from "next-i18next/client";
import {
  Input,
  Button,
  CardBody,
  Spinner,
  Chip,
  Pagination,
  Select,
  SelectItem,
} from "@heroui/react";
import { CardUniversal } from "@/components/common";
import {
  FaUserShield,
  FaUser,
  FaSearch,
  FaCalendarAlt,
  FaEnvelope,
  FaEdit,
  FaTrash,
  FaWeight,
  FaRuler,
  FaBullseye,
  FaRunning,
} from "react-icons/fa";
import { useUsersTab } from "../hooks/useUsersTab";
import { UserEditModal } from "./modals/UserEditModal";
import { DeleteConfirmationModal } from "./modals/DeleteConfirmationModal";

type UsersTabProps = {
  lng: string;
};

export const UsersTab = ({ lng }: UsersTabProps) => {
  const { t } = useT("admin");
  const {
    isOpen,
    onOpenChange,
    onClose,
    isUserDeleteOpen,
    onUserDeleteOpenChange,
    onUserDeleteClose,
    users,
    usersLoading,
    userSearch,
    roleFilter,
    selectedUser,
    userToDelete,
    userDeleteLoading,
    userPage,
    setUserPage,
    userTotalPages,
    isRoleOpen,
    setIsRoleOpen,
    handleUserSearchChange,
    handleRoleFilterChange,
    handleUserEditClick,
    handleUserDeleteClick,
    handleUserUpdateSubmit,
    handleUserDeleteSubmit,
  } = useUsersTab(t);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            value={userSearch}
            onChange={(e) => handleUserSearchChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            variant="faded"
            startContent={<FaSearch className="text-default-400" />}
            isClearable
            onClear={() => handleUserSearchChange("")}
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

      <div className="flex flex-col gap-4">
        {usersLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Spinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-default-400 text-sm">
            {t("noUsersFound")}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map((user) => (
                <CardUniversal key={user.id} className="transition-all duration-200">
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
                        onPress={() => handleUserEditClick(user)}
                      >
                        {t("table.edit")}
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        className="font-bold flex-1"
                        startContent={<FaTrash />}
                        onPress={() => handleUserDeleteClick(user)}
                      >
                        {t("table.delete")}
                      </Button>
                    </div>
                  </CardBody>
                </CardUniversal>
              ))}
            </div>

            {userTotalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  total={userTotalPages}
                  page={userPage}
                  onChange={(newPage) => setUserPage(newPage)}
                  color="primary"
                  variant="flat"
                />
              </div>
            )}
          </>
        )}
      </div>

      <UserEditModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        selectedUser={selectedUser}
        onSubmit={handleUserUpdateSubmit}
        isRoleOpen={isRoleOpen}
        setIsRoleOpen={setIsRoleOpen}
        t={t}
      />

      <DeleteConfirmationModal
        isOpen={isUserDeleteOpen}
        onOpenChange={onUserDeleteOpenChange}
        title={t("deleteModal.title")}
        confirmText={t("deleteModal.confirmText", { name: userToDelete?.name })}
        cancelBtnText={t("deleteModal.cancelBtn")}
        confirmBtnText={t("deleteModal.confirmBtn")}
        isLoading={userDeleteLoading}
        onConfirm={handleUserDeleteSubmit}
        onClose={onUserDeleteClose}
      />
    </div>
  );
};
