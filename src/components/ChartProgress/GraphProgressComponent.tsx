"use client";

import { useState } from "react";
import useMacros from "../../hooks/useRecomendedMacros";
import { CardBody } from "@nextui-org/react";
import ChartProgress from "./ChartProgress";
import { CardUniversal } from "../common";
import { FaChartLine } from "react-icons/fa";
import { useT } from "next-i18next/client";

const MyGraph = () => {
  const { labels, macroDatasets, RecommendedMacros } = useMacros();
  const [selectedMacro, setSelectedMacro] =
    useState<keyof typeof macroDatasets>("protein");
  const { t } = useT("dashboard");

  if (labels.length < 1) {
    return (
      <CardUniversal
        id="tour-chart"
        className="w-full shadow-xl h-64 flex items-center justify-center"
      >
        <CardBody className="flex flex-col items-center justify-center text-center gap-3">
          <FaChartLine size={90} />
          <div>
            <h3 className="text-lg font-semibold text-default-700">
              {t("chart.noDataYet")}
            </h3>
            <p className="text-sm text-default-500 max-w-[200px] mx-auto mt-1">
              {t("chart.logThreeDays")}
            </p>
          </div>
        </CardBody>
      </CardUniversal>
    );
  }

  const emptyDays = macroDatasets["calories"].filter((v) => v === 0).length;

  return (
    <div id="tour-chart" className="flex flex-col w-full shadow-xl">
      <div className="w-full overflow-auto">
        <div className="w-full">
          <ChartProgress
            labels={labels}
            dataValues={macroDatasets[selectedMacro]}
            recommendedValue={RecommendedMacros[selectedMacro]}
            selectedMacro={selectedMacro}
            macroDatasets={macroDatasets}
            setSelectedMacro={setSelectedMacro}
            emptyDays={emptyDays}
            messageForSelectedMacro={""}
          />
        </div>
      </div>
    </div>
  );
};

export default MyGraph;
