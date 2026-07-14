"use client";

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { Formik, Form } from "formik";
import DynamicFaIcon from "@/components/DynamicFaIcon/DynamicFaIcon";

type ActivityItem = {
  _id: string;
  name: string;
  metValue: number;
  category?: string;
  icon?: string;
};

type AdminActivityModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  selectedActivity: ActivityItem | null;
  onSubmit: (values: any, helpers: any) => Promise<void>;
  t: (key: string) => string;
};

const activityIcons = [
  { name: "Running", value: "FaRunning" },
  { name: "Walking", value: "FaWalking" },
  { name: "Bicycling", value: "FaBicycle" },
  { name: "Swimming", value: "FaSwimmer" },
  { name: "Conditioning", value: "FaDumbbell" },
  { name: "Hiking", value: "FaHiking" },
  { name: "Climbing", value: "FaMountain" },
  { name: "Soccer", value: "FaFutbol" },
  { name: "Basketball", value: "FaBasketballBall" },
  { name: "Volleyball", value: "FaVolleyballBall" },
  { name: "Baseball", value: "FaBaseballBall" },
  { name: "Ping Pong", value: "FaTableTennis" },
  { name: "Golf", value: "FaGolfBall" },
  { name: "Bowling", value: "FaBowlingBall" },
  { name: "Boxing", value: "FaFistRaised" },
  { name: "Skiing", value: "FaSkiing" },
  { name: "Snowboarding", value: "FaSnowboarding" },
  { name: "Skating", value: "FaSkating" },
  { name: "Skateboarding", value: "FaSkateboard" },
  { name: "Rowing", value: "FaAnchor" },
  { name: "Yoga", value: "FaSpa" },
  { name: "Dancing", value: "FaMusic" },
  { name: "Chores", value: "FaBroom" },
  { name: "Cardio", value: "FaHeartbeat" },
  { name: "Stopwatch", value: "FaStopwatch" },
  { name: "Trophy", value: "FaTrophy" },
  { name: "Fire", value: "FaFire" },
];

export const AdminActivityModal = ({
  isOpen,
  onOpenChange,
  onClose,
  selectedActivity,
  onSubmit,
  t,
}: AdminActivityModalProps) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isIconOpen, setIsIconOpen] = useState(false);

  const activityCategories = [
    "General",
    "Conditioning",
    "Running",
    "Water",
    "Bicycling",
    "Sports",
    "Walking",
  ];

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
              name: selectedActivity?.name || "",
              metValue: selectedActivity?.metValue || 0,
              category: selectedActivity?.category || "General",
              icon: selectedActivity?.icon || "FaFire",
            }}
            validate={(values) => {
              const errors: Record<string, string> = {};
              if (!values.name.trim()) {
                errors.name = t("activityModal.nameRequired") || "Name is required";
              }
              if (Number(values.metValue) <= 0) {
                errors.metValue = t("activityModal.metValueRequired") || "MET value must be > 0";
              }
              return errors;
            }}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({ values, handleChange, handleBlur, isSubmitting, errors, touched, setFieldValue }) => (
              <Form className="w-full">
                <ModalHeader className="flex flex-col gap-1">
                  {selectedActivity ? t("activityModal.editTitle") : t("activityModal.createTitle")}
                </ModalHeader>
                <ModalBody className="flex flex-col gap-4">
                  <Input
                    name="name"
                    label={t("activityModal.nameLabel")}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="faded"
                    isDisabled={isSubmitting}
                    isInvalid={touched.name && !!errors.name}
                    errorMessage={touched.name && errors.name}
                  />

                  <Input
                    name="metValue"
                    label={t("activityModal.metValueLabel")}
                    type="number"
                    value={String(values.metValue)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="faded"
                    isDisabled={isSubmitting}
                    isInvalid={touched.metValue && !!errors.metValue}
                    errorMessage={touched.metValue && errors.metValue}
                  />

                  {/* Category Selection Dropdown */}
                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCategoryOpen(!isCategoryOpen);
                        setIsIconOpen(false);
                      }}
                      className={`w-full flex flex-col justify-center px-3 py-1.5 min-h-[56px] rounded-xl border-2 transition-colors duration-150 bg-transparent text-left relative focus:outline-none ${
                        isCategoryOpen
                          ? "border-zinc-500 dark:border-zinc-400"
                          : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
                      }`}
                    >
                      <span className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 select-none mb-0.5">
                        {t("activityModal.categoryLabel")}
                      </span>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
                        {values.category}
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
                            transform: isCategoryOpen ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </button>

                    {isCategoryOpen && (
                      <>
                        <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsCategoryOpen(false)} />
                        <div className="absolute left-0 right-0 mt-2 z-50 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl max-h-60 overflow-y-auto py-1 animate-appearance-in">
                          {activityCategories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setFieldValue("category", cat);
                                setIsCategoryOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors duration-150 capitalize ${
                                values.category === cat
                                  ? "bg-blue-600 text-white"
                                  : "text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Icon Selection Dropdown Grid */}
                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => {
                        setIsIconOpen(!isIconOpen);
                        setIsCategoryOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-1.5 min-h-[56px] rounded-xl border-2 transition-colors duration-150 bg-transparent text-left relative focus:outline-none ${
                        isIconOpen
                          ? "border-zinc-500 dark:border-zinc-400"
                          : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                        <DynamicFaIcon name={values.icon || "FaFire"} size={18} />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 select-none mb-0.5">
                          {t("activityModal.iconLabel") || "Icon"}
                        </span>
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {values.icon || "Select an Icon"}
                        </span>
                      </div>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="w-4 h-4 transition-transform duration-200"
                          style={{
                            transform: isIconOpen ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </button>

                    {isIconOpen && (
                      <>
                        <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsIconOpen(false)} />
                        <div className="absolute left-0 right-0 mt-2 z-50 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl max-h-60 overflow-y-auto p-3 animate-appearance-in">
                          <div className="grid grid-cols-4 gap-2">
                            {activityIcons.map((actIcon) => (
                              <button
                                key={actIcon.value}
                                type="button"
                                onClick={() => {
                                  setFieldValue("icon", actIcon.value);
                                  setIsIconOpen(false);
                                }}
                                title={actIcon.name}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-150 ${
                                  values.icon === actIcon.value
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                }`}
                              >
                                <DynamicFaIcon name={actIcon.value} size={18} />
                                <span className="text-[9px] mt-1 text-center truncate w-full">{actIcon.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={modalClose} isDisabled={isSubmitting}>
                    {t("activityModal.cancel")}
                  </Button>
                  <Button color="primary" type="submit" className="font-bold" isLoading={isSubmitting}>
                    {t("activityModal.save")}
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
