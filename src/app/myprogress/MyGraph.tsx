"use client";

import Chart from "./Chart";
import { useMemo, useState } from "react";
import useMacros from "./useRecomendedMacros";
import { Card, CardBody, Spinner } from "@nextui-org/react";

import { Image } from "@nextui-org/react";

const MyGraph = () => {
  const {
    labels,
    isLoading,
    macroDatasets,
    RecommendedMacros,
    getMacroMessage,
  } = useMacros();
  const [selectedMacro, setSelectedMacro] =
    useState<keyof typeof macroDatasets>("protein");

  const messageForSelectedMacro = useMemo(() => {
    return getMacroMessage(selectedMacro);
  }, [getMacroMessage, selectedMacro]);

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Spinner />
        Loading graph, please wait...
      </div>
    );
  }

  if (labels.length === 0) {
    return <p>No data available to display the graph.</p>;
  }

  const emptyDays = macroDatasets["calories"].filter((v) => v === 0).length;

  return (
    <div className="flex flex-col items-center gap-6 w-full x-2">
      <Card>
        <CardBody>
          {messageForSelectedMacro.length === 0 ? (
            <Spinner />
          ) : (
            <>
              <div className="w-full max-w-3xl overflow-auto">
                <div className="w-full min-w-[760px] ">
                  <Chart
                    labels={labels}
                    dataValues={macroDatasets[selectedMacro]}
                    recommendedValue={RecommendedMacros[selectedMacro]}
                    selectedMacro={selectedMacro}
                    macroDatasets={macroDatasets}
                    setSelectedMacro={setSelectedMacro}
                    emptyDays={emptyDays}
                  />
                </div>
              </div>

              <div className="w-full max-w-3xl flex flex-row items-center gap-4 p-4  shadow-sm">
                <div className="flex-shrink-0 w-1/6 sm:w-24 hidden sm:block">
                  <Image
                    className="object-contain"
                    alt="Info"
                    src="/eplaining_owl.png"
                    width={90}
                    height={90}
                  />
                </div>

                {/* The min-w-0 fix prevents the text from ballooning out your layout */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-default-700 break-words whitespace-normal">
                    {messageForSelectedMacro}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default MyGraph;
