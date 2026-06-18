import { useIsSm } from "@/app/[lng]/constants/FunctionsHelper";
import { authClient } from "@/lib/auth-client";
import { driver } from "driver.js";
import { useT } from "next-i18next/client";
import { useEffect } from "react";

type Session = typeof authClient.$Infer.Session.user;

type props = {
  isFetched: boolean;
  user: Session | undefined;
};

const useGuide = ({ isFetched, user }: props) => {
  const { t } = useT("dashboard");
  const isMobile = !useIsSm();
  useEffect(() => {
    if (isFetched && user && user.guideSeen === false) {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: "#tour-date",
            popover: {
              title: t("tour.timeTravel.title"),
              description: t("tour.timeTravel.description"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tour-calories",
            popover: {
              title: t("tour.calorieBudget.title"),
              description: t("tour.calorieBudget.description"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tour-macros",
            popover: {
              title: t("tour.macroBreakdown.title"),
              description: t("tour.macroBreakdown.description"),
              side: "bottom",
              align: "start",
            },
          },

          {
            element: "#tour-meals",
            popover: {
              title: t("tour.yourMeals.title"),
              description: t("tour.yourMeals.description"),
              side: "top",
              align: "start",
            },
          },
          {
            element: "#tour-chart",
            popover: {
              title: t("tour.yourProgress.title"),
              description: t("tour.yourProgress.description"),
              side: "top",
              align: "start",
            },
          },
          {
            element: isMobile
              ? "#tour-profile-mobile"
              : "#tour-profile-desktop",
            popover: {
              title: t("tour.yourProfile.title"),
              description: t("tour.yourProfile.description"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: isMobile ? "#tour-search-bar-mobile" : "#tour-search-bar",
            popover: {
              title: t("tour.manualSearch.title"),
              description: t("tour.manualSearch.description"),
              side: "bottom",
              align: "start",
            },
          },
          {
            element: isMobile ? "#tour-search-bar-mobile" : "#tour-barcode-ai",
            popover: {
              title: t("tour.smartScanning.title"),
              description: t("tour.smartScanning.description"),
              side: "top",
              align: "center",
            },
          },
        ],
        onDestroyStarted: async () => {
          driverObj.destroy();

          // Update the database so they never see it again
          try {
            await authClient.updateUser({ guideSeen: true });
          } catch (error) {
            console.error("Failed to update guide status:", error);
          }
        },
      });

      setTimeout(() => driverObj.drive(), 200);
    }
  }, [isFetched, user]);
};
export default useGuide;
