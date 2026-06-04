"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";

export default function ProfileMainComponent({ images }: { images: string[] }) {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col ">
      <div className="md:col-span-8 flex flex-col gap-6">
        {/* 1. BIOMETRICS & GOALS */}
        <Card className="shadow-md bg-zinc-900/80 backdrop-blur-md border border-zinc-800">
          <CardHeader className="pb-2 pt-6 px-6">
            <h3 className="text-lg font-bold text-white">Biometrics & Goals</h3>
          </CardHeader>
          <Divider className="bg-zinc-800" />
          <CardBody className="px-6 py-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Current Weight (kg)"
                type="number"
                defaultValue="75"
                variant="faded"
              />
              <Input
                label="Goal Weight (kg)"
                type="number"
                defaultValue="70"
                variant="faded"
              />
              <Input
                label="Height (cm)"
                type="number"
                defaultValue="180"
                variant="faded"
              />
              <Select
                label="Activity Level"
                defaultSelectedKeys={["light"]}
                variant="faded"
              >
                <SelectItem key="sedentary" value="sedentary">
                  Sedentary
                </SelectItem>
                <SelectItem key="light" value="light">
                  Lightly Active
                </SelectItem>
                <SelectItem key="moderate" value="moderate">
                  Moderately Active
                </SelectItem>
                <SelectItem key="active" value="active">
                  Very Active
                </SelectItem>
              </Select>
              <Select
                label="Primary Goal"
                defaultSelectedKeys={["cut"]}
                variant="faded"
              >
                <SelectItem key="cut" value="cut">
                  Lose Fat
                </SelectItem>
                <SelectItem key="maintain" value="maintain">
                  Maintain Weight
                </SelectItem>
                <SelectItem key="bulk" value="bulk">
                  Build Muscle
                </SelectItem>
              </Select>
            </div>
            <Button className="w-fit mt-2 bg-[#00FFAA] text-black font-bold">
              Update Biometrics
            </Button>
          </CardBody>
        </Card>

        {/* 2. MACRO TARGETS */}
        <Card className="shadow-md bg-zinc-900/80 backdrop-blur-md border border-zinc-800">
          <CardHeader className="flex justify-between items-center pb-2 pt-6 px-6">
            <h3 className="text-lg font-bold text-white">Macro Targets</h3>
            <Switch size="sm" color="success">
              Manual Override
            </Switch>
          </CardHeader>
          <Divider className="bg-zinc-800" />
          <CardBody className="px-6 py-6 flex flex-col gap-4">
            <p className="text-sm text-zinc-400 mb-2">
              These are automatically calculated based on your biometrics.
              Enable Manual Override to set custom goals.
            </p>
            <Input
              label="Daily Calories"
              type="number"
              defaultValue="2200"
              variant="faded"
              isDisabled // Remove this when override is toggled
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Protein (g)"
                type="number"
                defaultValue="160"
                variant="faded"
                isDisabled
              />
              <Input
                label="Carbs (g)"
                type="number"
                defaultValue="200"
                variant="faded"
                isDisabled
              />
              <Input
                label="Fat (g)"
                type="number"
                defaultValue="85"
                variant="faded"
                isDisabled
              />
            </div>
            <Button className="w-fit mt-2 bg-[#00FFAA] text-black font-bold">
              Save Targets
            </Button>
          </CardBody>
        </Card>

        {/* 3. DANGER ZONE */}
        <Card className="shadow-md bg-zinc-900/80 backdrop-blur-md border border-red-500/30">
          <CardHeader className="pb-2 pt-6 px-6">
            <h3 className="text-lg font-bold text-red-500">Danger Zone</h3>
          </CardHeader>
          <Divider className="bg-red-500/20" />
          <CardBody className="px-6 py-6 flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm font-bold text-white">Delete Account</p>
              <p className="text-xs text-zinc-400 mt-1">
                Permanently delete your account, biometrics, and all scanned
                food data. This cannot be undone.
              </p>
            </div>
            <Button color="danger" variant="flat" className="font-bold">
              Delete Account
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
