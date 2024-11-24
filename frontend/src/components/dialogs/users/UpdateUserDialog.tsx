import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { create } from "zustand";
import { DialogState } from "../../../states/dialog-state";
import { UserPublic } from "@/client/types.gen";
import { UpdateUserForm } from "../../forms/users/UpdateUserForm";

export const useUserDialogState = create<DialogState<UserPublic>>((set) => ({
  isOpen: false,
  toggleModal: () =>
    set((state: DialogState<UserPublic>) => ({ isOpen: !state.isOpen })),
  data: null,
  setData: (data: UserPublic) => set(() => ({ data: data })),
}));

export default function EditUserDialog(
  props: Pick<DialogState<UserPublic>, "isOpen" | "data" | "toggleModal"> & {
    onUpdate: () => Promise<void>;
  }
) {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.toggleModal}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Изменить пользователя</DialogTitle>
          <DialogDescription>
            Изменение учетной записи пользователя.
          </DialogDescription>
        </DialogHeader>
        <UpdateUserForm user={props.data} onUpdate={props.onUpdate} />
      </DialogContent>
    </Dialog>
  );
}
