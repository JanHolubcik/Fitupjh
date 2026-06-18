import { CardUniversal } from "@/components/common";
import { authClient } from "@/lib/auth-client";
import { CardHeader, Divider, CardBody, Button } from "@nextui-org/react";
import { useT } from "next-i18next/client";
import { toast } from "react-toastify";

export const DeleteAccount = () => {
  const { t } = useT("profile");
  const handleDeleteAccount = async () => {
    if (!confirm(t("deleteAccountConfirm", "Are you sure you want to delete your account?"))) return;
    const { error } = await authClient.deleteUser({ callbackURL: "/" });
    if (error) toast.error(error.message || t("toast.deleteError", "Failed to delete account"));
  };
  return (
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
          className="font-semibold w-full sm:w-fit"
          onPress={handleDeleteAccount}
        >
          {t("deleteAccount")}
        </Button>
      </CardBody>
    </CardUniversal>
  );
};
