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
import { SignupUserForm } from "../forms/SignupUserForm";

export default function CreateUserDialog({
  onUpdate,
}: {
  onUpdate: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 lg:flex">
          Добавить пользователя
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Создать новую учетную запись
          </DialogTitle>
          <DialogDescription>Введите все необходимые данные.</DialogDescription>
        </DialogHeader>
        <SignupUserForm onUpdate={onUpdate} />
      </DialogContent>
    </Dialog>
  );
}
