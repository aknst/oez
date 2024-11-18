import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { RotateCcw } from "lucide-react";

export const HomePage = () => {
  return (
    <div className="p-4 pt-0">
      <div className=" flex-col">
        <div className="container flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold">NLP</h2>
          {/* <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <PresetSelector presets={presets} />
            <PresetSave />
            <div className="hidden space-x-2 md:flex">
              <CodeViewer />
              <PresetShare />
            </div>
            <PresetActions /> */}
        </div>
      </div>
      <Separator />
      <div className="container h-full py-6">
        <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
          <div className="hidden flex-col space-y-4 sm:flex md:order-2">
            <div className="grid gap-2">тест</div>
            {/* <ModelSelector types={types} models={models} />
                <TemperatureSelector defaultValue={[0.56]} />
                <MaxLengthSelector defaultValue={[256]} />
                <TopPSelector defaultValue={[0.9]} /> */}
          </div>
          <div className="md:order-1">
            <div className="flex flex-col space-y-4">
              <div className="grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1">
                <div>
                  <AppointmentForm
                    appointment={null}
                    onUpdate={function (): Promise<void> {
                      throw new Error("Function not implemented.");
                    }}
                  />
                </div>
                <div className="rounded-md border bg-muted"></div>
              </div>
              <div className="flex items-center space-x-2">
                <Button>Submit</Button>
                <Button variant="secondary">
                  <span className="sr-only">Show history</span>
                  <RotateCcw />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
