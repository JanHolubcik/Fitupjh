"use client";

import Chart from "./Chart";
import { useState } from "react";
import useMacros from "./useRecomendedMacros";
import { Spinner } from "@nextui-org/react";

const MyGraph = () => {
  const { labels, isLoading, macroDatasets, RecommendedMacros } = useMacros();
  const [selectedMacro, setSelectedMacro] =
    useState<keyof typeof macroDatasets>("protein");

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
    <div className="flex flex-col sm:w-full w-80 shadow-xl ">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="w-full  overflow-auto">
            <div className="w-full  ">
              <Chart
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
        </>
      )}
    </div>
  );
};

export default MyGraph;
