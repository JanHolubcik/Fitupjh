"use client";
import { Progress } from "@nextui-org/react";

type Food = {
  timeOfDay: "breakfast" | "lunch" | "dinner";
};

const ProgressBars = (props: Food) => {
  return (
    <div className="flex flex-col min-w-96">
      <h1 className="self-center text-lg m-3 ">Today intake</h1>

      <div className="flex flex-row ">
        <Progress
          label="Protein"
          showValueLabel
          value={55}
          className="max-w-md m-2"
        />
        <Progress
          label="Fat"
          showValueLabel
          value={55}
          className="max-w-md m-2"
        />
      </div>
      <div className="flex flex-row">
        <Progress
          label="Sugar"
          showValueLabel
          value={55}
          className="max-w-md m-2"
        />
        <Progress
          label="Carbohydrates"
          showValueLabel
          value={55}
          className="max-w-md m-2"
        />
      </div>
      <div className="flex flex-row">
        <Progress
          label="Fiber"
          showValueLabel
          value={55}
          className="max-w-md m-2"
        />
        <Progress
          label="Salt"
          showValueLabel
          value={55}
          className="max-w-md m-2"
        />
      </div>
      <Progress
        label="Calories"
        showValueLabel
        value={55}
        className="max-w-80 m-2 self-center"
      />
    </div>
  );
};

export default ProgressBars;
