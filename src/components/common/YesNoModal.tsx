import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useModalBackButton } from "@/hooks/useModalBackButton";

type YesNoModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "danger" | "success" | "warning";
  isLoading?: boolean;
};

const YesNoModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Yes",
  cancelText = "No",
  confirmColor = "danger",
  isLoading = false,
}: YesNoModalProps) => {
  useModalBackButton(isOpen, () => onOpenChange(false));

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
      classNames={{
        base: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 max-w-sm rounded-2xl p-2",
        header: "pb-2 pt-4 px-4 font-bold text-lg",
        body: "py-2 px-4 text-sm text-zinc-600 dark:text-zinc-400 font-medium",
        footer: "pt-4 pb-2 px-4 flex gap-3",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>{description}</ModalBody>
            <ModalFooter>
              <Button
                size="sm"
                variant="flat"
                className="flex-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl"
                onPress={onClose}
                isDisabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button
                size="sm"
                color={confirmColor}
                className="flex-1 font-bold rounded-xl text-white"
                onPress={onConfirm}
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default YesNoModal;
