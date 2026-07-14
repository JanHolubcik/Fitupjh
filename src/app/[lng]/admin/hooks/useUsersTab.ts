"use client";

import { useState, useEffect } from "react";
import { useDisclosure } from "@heroui/react";
import { showToast } from "@/utils/toast";
import { ApiResponse } from "@/lib/api-response";
import { AdminUser } from "@/lib/mongo/admin-db";

export const useUsersTab = (t: any) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isUserDeleteOpen, onOpen: onUserDeleteOpen, onOpenChange: onUserDeleteOpenChange, onClose: onUserDeleteClose } = useDisclosure();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [userDeleteLoading, setUserDeleteLoading] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const limit = 6;

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await fetch(
        `/api/admin/users?query=${encodeURIComponent(userSearch)}&role=${roleFilter}&page=${userPage}&limit=${limit}`
      );
      if (!response.ok) throw new Error();
      const resData = (await response.json()) as ApiResponse<{ users: AdminUser[]; total: number }>;
      if (resData.data) {
        setUsers(resData.data.users || []);
        setUserTotalPages(Math.ceil(resData.data.total / limit) || 1);
      }
    } catch (error) {
      console.error(error);
      showToast.error(t("toasts.fetchError"));
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [userSearch, roleFilter, userPage]);

  const handleUserSearchChange = (val: string) => {
    setUserSearch(val);
    setUserPage(1);
  };

  const handleRoleFilterChange = (val: string) => {
    setRoleFilter(val);
    setUserPage(1);
  };

  const handleUserEditClick = (user: AdminUser) => {
    setSelectedUser(user);
    setIsRoleOpen(false);
    onOpen();
  };

  const handleUserDeleteClick = (user: AdminUser) => {
    setUserToDelete(user);
    onUserDeleteOpen();
  };

  const handleUserUpdateSubmit = async (
    values: { name: string; email: string; role: string },
    { setSubmitting }: { setSubmitting: (b: boolean) => void }
  ) => {
    if (!selectedUser) return;
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          name: values.name,
          email: values.email,
          role: values.role,
        }),
      });
      if (!response.ok) throw new Error();
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

  const handleUserDeleteSubmit = async () => {
    if (!userToDelete) return;
    setUserDeleteLoading(true);
    try {
      const response = await fetch(`/api/admin/users?userId=${userToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      showToast.success(t("toasts.deleteSuccess"));
      onUserDeleteClose();
      fetchUsers();
    } catch (error) {
      console.error(error);
      showToast.error(t("toasts.deleteError"));
    } finally {
      setUserDeleteLoading(false);
    }
  };

  return {
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
  };
};
