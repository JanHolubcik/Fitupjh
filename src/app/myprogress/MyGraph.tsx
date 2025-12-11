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
    <div className="flex flex-col items-center gap-6 w-full px-4">
      <div className="w-full max-w-3xl overflow-auto">
        <div className="w-full min-w-[760px] ">
          <Chart
            labels={labels}
            dataValues={macroDatasets[selectedMacro]}
            recommendedValue={RecommendedMacros[selectedMacro]}
            selectedMacro={selectedMacro}
          />
        </div>
      </div>
      <ButtonGroup className="flex flex-wrap justify-center gap-2 w-full max-w-3xl">
        {Object.keys(macroDatasets).map((macro) => (
          <div
            key={macro}
            className="flex-1 sm:flex-none sm:basis-1/3 md:basis-1/4"
          >
            <Button
              color={macro === selectedMacro ? "primary" : "default"}
              onPress={() =>
                setSelectedMacro(macro as keyof typeof macroDatasets)
              }
              radius="md"
              className="w-full"
              variant="bordered"
            >
              {capitalizeFirstLetter(macro)}
            </Button>
          </div>
        ))}
      </ButtonGroup>

      <Card className="w-full max-w-3xl">
        <CardBody className="flex flex-row items-center gap-4 p-4">
          <div className="flex-shrink-0 w-1/6 sm:w-24 hidden sm:block">
            <Image
              className="object-contain"
              alt="Info"
              src="/eplaining_owl.png"
              width={90}
              height={90}
            />
          </div>
          <div className="flex-1 break-words">
            <p>{messageForSelectedMacro}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default MyGraph;
