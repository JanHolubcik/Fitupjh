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
} from "@heroui/react";
import { CardUniversal } from "@/components/common";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { useActivitiesTab } from "../hooks/useActivitiesTab";
import { ActivityModal } from "./modals/ActivityModal";
import { DeleteConfirmationModal } from "./modals/DeleteConfirmationModal";
import DynamicFaIcon from "@/components/DynamicFaIcon/DynamicFaIcon";

type ActivitiesTabProps = {
  lng: string;
};

export const ActivitiesTab = ({ lng }: ActivitiesTabProps) => {
  const { t } = useT("admin");
  const {
    isActivityOpen,
    onActivityOpenChange,
    onActivityClose,
    isActivityDeleteOpen,
    onActivityDeleteOpenChange,
    onActivityDeleteClose,
    activities,
    activitiesLoading,
    activitySearch,
    selectedActivity,
    activityToDelete,
    activityDeleteLoading,
    activityPage,
    setActivityPage,
    activityTotalPages,
    isActivityCategoryOpen,
    setIsActivityCategoryOpen,
    handleActivitySearchChange,
    handleActivityCreateClick,
    handleActivityEditClick,
    handleActivityDeleteClick,
    handleActivitySubmit,
    handleActivityDeleteSubmit,
  } = useActivitiesTab(t);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Input
          value={activitySearch}
          onChange={(e) => handleActivitySearchChange(e.target.value)}
          placeholder={t("searchActivityPlaceholder")}
          variant="faded"
          startContent={<FaSearch className="text-default-400" />}
          isClearable
          onClear={() => handleActivitySearchChange("")}
          className="max-w-md w-full"
        />
        <Button
          color="primary"
          onPress={handleActivityCreateClick}
          startContent={<FaPlus />}
          className="font-bold shrink-0 w-full sm:w-auto"
        >
          {t("createActivityBtn")}
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {activitiesLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Spinner size="lg" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-16 text-default-400 text-sm">
            {t("noActivitiesFound")}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activities.map((act) => (
                <CardUniversal key={act._id} className="transition-all duration-200">
                  <CardBody className="p-5 flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-extrabold text-base text-foreground truncate max-w-[180px]">
                          {act.name}
                        </h3>
                        <Chip
                          size="sm"
                          variant="flat"
                          color="primary"
                          className="font-bold text-[10px] tracking-wide"
                        >
                          MET: {act.metValue}
                        </Chip>
                      </div>

                      <div className="flex items-center gap-1.5 mt-2 text-xs text-default-500">
                        <span className="font-semibold text-default-400">Category:</span>
                        <span className="capitalize">{act.category || "General"}</span>
                      </div>
                      {act.icon && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-default-500">
                          <span className="font-semibold text-default-400">Icon:</span>
                          <span className="text-primary bg-primary/10 p-1.5 rounded-lg">
                            <DynamicFaIcon name={act.icon} size={16} />
                          </span>
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
                        onPress={() => handleActivityEditClick(act)}
                      >
                        {t("table.edit")}
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        className="font-bold flex-1"
                        startContent={<FaTrash />}
                        onPress={() => handleActivityDeleteClick(act)}
                      >
                        {t("table.delete")}
                      </Button>
                    </div>
                  </CardBody>
                </CardUniversal>
              ))}
            </div>

            {activityTotalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  total={activityTotalPages}
                  page={activityPage}
                  onChange={(newPage) => setActivityPage(newPage)}
                  color="primary"
                  variant="flat"
                />
              </div>
            )}
          </>
        )}
      </div>

      <ActivityModal
        isOpen={isActivityOpen}
        onOpenChange={onActivityOpenChange}
        onClose={onActivityClose}
        selectedActivity={selectedActivity}
        onSubmit={handleActivitySubmit}
        t={t}
      />

      <DeleteConfirmationModal
        isOpen={isActivityDeleteOpen}
        onOpenChange={onActivityDeleteOpenChange}
        title={t("deleteActivityModal.title")}
        confirmText={t("deleteActivityModal.confirmText", { name: activityToDelete?.name })}
        cancelBtnText={t("deleteActivityModal.cancelBtn")}
        confirmBtnText={t("deleteActivityModal.confirmBtn")}
        isLoading={activityDeleteLoading}
        onConfirm={handleActivityDeleteSubmit}
        onClose={onActivityDeleteClose}
      />
    </div>
  );
};
