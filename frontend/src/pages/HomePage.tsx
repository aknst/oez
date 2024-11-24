import DiseaseAppointmentsHistory from "@/components/dialogs/appointments/DiseaseAppointmentsHistory";
import {
  AppointmentFormValues,
  AppointmentForm,
} from "@/components/forms/appointments/AppointmentForm";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  const [selectedModel, setSelectedModel] = useState<string>("bert");
  const [formData, setFormData] = useState<AppointmentFormValues>();

  const onUpdate = (data: AppointmentFormValues) => {
    setFormData(data);
  };

  const handleSelect = (value: string) => {
    setSelectedModel(value);
  };

  return (
    <div className="p-4 pt-0">
      <div className=" flex-col">
        <div className="container flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <Button onClick={() => navigate(0)} variant={"outline"}>
            Новый прием
          </Button>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <DiseaseAppointmentsHistory diseaseId={formData?.disease_id} />
          </div>
        </div>
      </div>
      <Separator />
      <div className="container h-full py-6">
        <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
          <div className="hidden flex-col space-y-4 sm:flex md:order-2">
            <div className="grid space-y-6">
              <div className="grid gap-2">
                <Label>Модель для классификации</Label>
                <Select defaultValue={"bert"} onValueChange={handleSelect}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Выберите модель" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="bert">Bert</SelectItem>
                      <SelectItem value="ensemble">Ансамбль</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Модель для рекомендаций</Label>
                <Select defaultValue={"gpt"}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Выберите модель" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="gpt">GPT-Static</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="md:order-1">
            <AppointmentForm
              onUpdate={onUpdate}
              selectedModel={selectedModel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
