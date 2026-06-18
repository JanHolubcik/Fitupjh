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
} from "@nextui-org/react";
import { Formik, Form } from "formik";

import { useT } from "next-i18next/client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type User = typeof authClient.$Infer.Session.user;

export const BiometricAndGoals = ({ user }: { user: User }) => {
  const router = useRouter();
  const { t } = useT("profile");
  const handleManualSubmit = async (values: any) => {
    const updatePromise = authClient.updateUser({
      weight: Number(values.weight),
      weightGoal: Number(values.weightGoal),
      height: Number(values.height),
      activityLevel: values.activityLevel,
      goal: values.goal,
    });

    await toast.promise(
      updatePromise,
      {
        pending: t("toast.biometricPending", "Updating biometrics..."),
        success: t("toast.biometricSuccess", "Biometrics updated successfully!"),
        error: {
          render({ data }: any) {
            return data?.message || t("toast.error", "Failed to update profile.");
          },
        },
      },
      { position: "bottom-left", autoClose: 3000, theme: "dark" },
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
        onSubmit={async (values, { setSubmitting }) => {
          await handleManualSubmit(values);
          setSubmitting(false);
        }}
      >
        {({ values, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <CardBody className="px-6 py-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Added size="sm" to all inputs here */}
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
                  min={50}
                  max={300}
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
                  min={50}
                  max={300}
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
                  min={50}
                  max={300}
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
                  <SelectItem key="sedentary" value="sedentary">
                    {t("sedentary")}
                  </SelectItem>
                  <SelectItem key="lightlyActive" value="lightlyActive">
                    {t("lightlyActive")}
                  </SelectItem>
                  <SelectItem key="mediumActive" value="mediumActive">
                    {t("moderatelyActive")}
                  </SelectItem>
                  <SelectItem key="highlyActive" value="highlyActive">
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
                  <SelectItem key="loseWeight" value="loseWeight">
                    {t("loseFat")}
                  </SelectItem>
                  <SelectItem key="maintainWeight" value="maintainWeight">
                    {t("maintainWeight")}
                  </SelectItem>
                  <SelectItem key="gainWeight" value="gainWeight">
                    {t("buildMuscle")}
                  </SelectItem>
                </Select>
              </div>
              <div className="flex sm:justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
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
