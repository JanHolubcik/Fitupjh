"use client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

type AdminDeleteConfirmationModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  confirmText: string;
  cancelBtnText: string;
  confirmBtnText: string;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export const AdminDeleteConfirmationModal = ({
  isOpen,
  onOpenChange,
  title,
  confirmText,
  cancelBtnText,
  confirmBtnText,
  isLoading,
  onConfirm,
  onClose,
}: AdminDeleteConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" placement="center">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-danger font-bold">
              {title}
            </ModalHeader>
            <ModalBody>
              <p className="text-sm">{confirmText}</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={isLoading}>
                {cancelBtnText}
              </Button>
              <Button color="danger" className="font-bold" isLoading={isLoading} onPress={onConfirm}>
                {confirmBtnText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
