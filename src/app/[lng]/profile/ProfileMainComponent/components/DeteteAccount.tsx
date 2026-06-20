import React, { useState } from "react";
import { CardUniversal, YesNoModal } from "@/components/common";
import { authClient } from "@/lib/auth-client";
import {
  CardHeader,
  Divider,
  CardBody,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useT } from "next-i18next/client";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";

export const DeleteAccount = () => {
  const { t } = useT("profile");
  const router = useRouter();
  const params = useParams();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  const currentLocale = params?.lng || "en";

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { error } = await authClient.deleteUser();
      if (error) {
        toast.error(error.message || t("toast.deleteError"));
        setIsDeleting(false);
      } else {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.success(t("toast.deleteSuccess"));
              onClose();
              router.refresh();
              router.push(`/${currentLocale}`);
            },
            onError: (ctx) => {
              console.error(
                "Sign out error after account deletion:",
                ctx.error,
              );
              toast.success(t("toast.deleteSuccess"));
              onClose();
              router.refresh();
              router.push(`/${currentLocale}`);
            },
          },
        });
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <CardUniversal className="shadow-md bg-red-50 dark:bg-zinc-900/80 backdrop-blur-md border border-red-200 dark:border-red-500/30">
        <CardHeader className="pb-2 pt-6 px-6">
          <h3 className="text-lg font-bold text-red-600 dark:text-red-500">
            {t("dangerZone")}
          </h3>
        </CardHeader>
        <Divider className="bg-red-200 dark:bg-red-500/20" />
        <CardBody className="px-6 py-6 flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm font-bold text-zinc-900 dark:text-white">
              {t("deleteAccount")}
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              {t("deleteAccountNotice")}
            </p>
          </div>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            className="font-semibold text-sm w-44"
            onPress={onOpen}
          >
            {t("deleteAccount")}
          </Button>
        </CardBody>
      </CardUniversal>

      <YesNoModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={handleDeleteAccount}
        title={t("deleteAccount")}
        description={t("deleteAccountConfirm")}
        confirmText={t("deleteAccount")}
        cancelText={t("cancel")}
        confirmColor="danger"
        isLoading={isDeleting}
      />
    </>
  );
};
