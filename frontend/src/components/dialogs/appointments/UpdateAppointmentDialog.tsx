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
import { AppointmentPublic } from "@/client/types.gen";
import { AppointmentForm } from "@/components/forms/appointments/AppointmentForm";
import { ScrollArea } from "@/components/ui/scroll-area";

export const useAppointmentDialogState = create<DialogState<AppointmentPublic>>(
  (set) => ({
    isOpen: false,
    toggleModal: () =>
      set((state: DialogState<AppointmentPublic>) => ({
        isOpen: !state.isOpen,
      })),
    data: null,
    setData: (data: AppointmentPublic) => set(() => ({ data: data })),
  })
);

export default function UpdateAppointmentDialog(
  props: Pick<
    DialogState<AppointmentPublic>,
    "isOpen" | "data" | "toggleModal"
  > & {
    onUpdate: () => Promise<void>;
  }
) {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.toggleModal}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="max-w-[80%]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Изменить прием</DialogTitle>
          <DialogDescription>
            Просмотр или изменение информации о приеме.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80dvh] pr-4 pb-4">
          {props.data && <AppointmentForm appointment={props.data} />}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
