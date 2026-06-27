import { CardUniversal } from "@/components/common";
import { authClient } from "@/lib/auth-client";
import {
  CardHeader,
  Divider,
  CardBody,
  Select,
  SelectItem,
  Button,
  Spinner,
  Input,
} from "@heroui/react";
import { Formik, Form } from "formik";

import { useT } from "next-i18next/client";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toast";
import { updateUserSchema } from "@/lib/validationShemas/userValidationSchema";

type User = typeof authClient.$Infer.Session.user;

export const BiometricAndGoals = ({ user }: { user: User }) => {
  const router = useRouter();
  const { t } = useT("profile");
  const handleManualSubmit = async (values: {
    weight: number | string;
    weightGoal: number | string;
    height: number | string;
    activityLevel: string;
    goal: string;
  }) => {
    const updatePromise = authClient.updateUser({
      weight: Number(values.weight),
      weightGoal: Number(values.weightGoal),
      height: Number(values.height),
      activityLevel: values.activityLevel,
      goal: values.goal,
    });

    await showToast.promise(
      updatePromise,
      {
        pending: t("toast.biometricPending"),
        success: t("toast.biometricSuccess"),
        error: {
          render({ data }: { data?: { message?: string } }) {
            return data?.message ? t(data.message) : t("toast.error");
          },
        },
      },
    );
    router.refresh();
  };
  return (
    <CardUniversal className="shadow-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-2 pt-6 px-6">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          {t("biometricsAndGoals")}
        </h3>
      </CardHeader>
      <Divider className="bg-zinc-200 dark:bg-zinc-800" />

      <Formik
        initialValues={{
          weight: user?.weight || "",
          weightGoal: user?.weightGoal || "",
          height: user?.height || "",
          activityLevel: user?.activityLevel || "sedentary",
          goal: user?.goal || "loseWeight",
        }}
        validate={(values) => {
          const errors: Record<string, string> = {};
          const result = updateUserSchema.safeParse(values);
          if (!result.success) {
            for (const issue of result.error.issues) {
              const field = issue.path[0] as string;
              errors[field] = t(issue.message);
            }
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          await handleManualSubmit(values);
          setSubmitting(false);
        }}
      >
        {({ values, handleChange, handleBlur, isSubmitting, errors, touched }) => (
          <Form>
            <CardBody className="px-6 py-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  size="sm"
                  name="weight"
                  label={t("currentWeight")}
                  type="number"
                  value={String(values.weight)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant="faded"
                  isDisabled={isSubmitting}
                  isInvalid={touched.weight && !!errors.weight}
                  errorMessage={touched.weight && errors.weight}
                />
                <Input
                  size="sm"
                  name="weightGoal"
                  label={t("goalWeight")}
                  type="number"
                  value={String(values.weightGoal)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant="faded"
                  isDisabled={isSubmitting}
                  isInvalid={touched.weightGoal && !!errors.weightGoal}
                  errorMessage={touched.weightGoal && errors.weightGoal}
                />
                <Input
                  size="sm"
                  name="height"
                  label={t("height")}
                  type="number"
                  value={String(values.height)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  variant="faded"
                  isDisabled={isSubmitting}
                  isInvalid={touched.height && !!errors.height}
                  errorMessage={touched.height && errors.height}
                />
                <Select
                  size="sm"
                  name="activityLevel"
                  label={t("activityLevel")}
                  selectedKeys={[values.activityLevel]}
                  onChange={handleChange}
                  variant="faded"
                  isDisabled={isSubmitting}
                >
                  <SelectItem key="sedentary">
                    {t("sedentary")}
                  </SelectItem>
                  <SelectItem key="lightlyActive">
                    {t("lightlyActive")}
                  </SelectItem>
                  <SelectItem key="mediumActive">
                    {t("moderatelyActive")}
                  </SelectItem>
                  <SelectItem key="highlyActive">
                    {t("veryActive")}
                  </SelectItem>
                </Select>
                <Select
                  size="sm"
                  name="goal"
                  label={t("primaryGoal")}
                  selectedKeys={[values.goal]}
                  onChange={handleChange}
                  variant="faded"
                  isDisabled={isSubmitting}
                >
                  <SelectItem key="loseWeight">
                    {t("loseFat")}
                  </SelectItem>
                  <SelectItem key="maintainWeight">
                    {t("maintainWeight")}
                  </SelectItem>
                  <SelectItem key="gainWeight">
                    {t("buildMuscle")}
                  </SelectItem>
                </Select>
              </div>
              <div className="flex sm:justify-end">
                <Button
                  type="submit"
                  size="sm"
                  isDisabled={isSubmitting}
                  className="w-full sm:w-fit bg-primary font-bold"
                >
                  {isSubmitting ? (
                    <Spinner size="sm" color="current" />
                  ) : (
                    t("updateBiometrics")
                  )}
                </Button>
              </div>
            </CardBody>
          </Form>
        )}
      </Formik>
    </CardUniversal>
  );
};
