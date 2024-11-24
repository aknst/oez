import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../../ui/button";
import { useState } from "react";
import { CreateUserForm } from "../../forms/users/CreateUserForm";

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
          <DialogDescription>
            Пользователю системы на электронную почту придут данные для
            авторизации.
          </DialogDescription>
        </DialogHeader>
        <CreateUserForm onUpdate={onUpdate} />
      </DialogContent>
    </Dialog>
  );
}
