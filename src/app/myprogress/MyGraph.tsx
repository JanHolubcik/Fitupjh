"use client";

import Chart from "./Chart";
import { useMemo, useState } from "react";
import useMacros from "./useRecomendedMacros";
import { Button, ButtonGroup, Card, CardBody } from "@nextui-org/react";
import { capitalizeFirstLetter } from "../constants/FunctionsHelper";
import { Image } from "@nextui-org/react";

const MyGraph = () => {
  const { labels, macroDatasets, RecommendedMacros, getMacroMessage } =
    useMacros();
  const [selectedMacro, setSelectedMacro] =
    useState<keyof typeof macroDatasets>("protein");

  const messageForSelectedMacro = useMemo(() => {
    return getMacroMessage(selectedMacro);
  }, [getMacroMessage, selectedMacro]);

  if (labels.length === 0) {
    return <p>No data available to display the graph.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-3xl">
        <Chart
          labels={labels}
          dataValues={macroDatasets[selectedMacro]}
          recommendedValue={RecommendedMacros[selectedMacro]}
          selectedMacro={selectedMacro}
        />
      </div>

      <ButtonGroup>
        {Object.keys(macroDatasets).map((macro) => (
          <Button
            key={macro}
            color={macro === selectedMacro ? "primary" : "default"}
            onPress={() =>
              setSelectedMacro(macro as keyof typeof macroDatasets)
            }
          >
            {capitalizeFirstLetter(macro)}
          </Button>
        ))}
      </ButtonGroup>

      <Card className="max-w-4xl w-full">
        <CardBody className="flex flex-row items-center h-36 gap-4">
          <div className="flex-shrink-0 w-1/10">
            <Image
              className="object-contain"
              alt="Info"
              src="/eplaining_owl.png"
              width={90}
              height={90}
            />
          </div>
          <div className="w-9/10 break-words ">
            <p>{messageForSelectedMacro}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default MyGraph;
