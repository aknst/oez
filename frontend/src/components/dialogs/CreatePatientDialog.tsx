import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { useState } from "react";
import { CreatePatientForm } from "../forms/CreatePatientForm";

export default function CreatePatientDialog({
  onUpdate,
}: {
  onUpdate: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 lg:flex">
          Добавить пациента
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Создать нового пациента
          </DialogTitle>
          <DialogDescription>Введите все необходимые данные.</DialogDescription>
        </DialogHeader>
        <CreatePatientForm onUpdate={onUpdate} />
      </DialogContent>
    </Dialog>
  );
}
