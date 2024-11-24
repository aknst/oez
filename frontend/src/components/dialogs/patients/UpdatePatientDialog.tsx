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
import { PatientPublic } from "@/client/types.gen";
import { UpdatePatientForm } from "@/components/forms/patients/UpdatePatientForm";

export const usePatientDialogState = create<DialogState<PatientPublic>>(
  (set) => ({
    isOpen: false,
    toggleModal: () =>
      set((state: DialogState<PatientPublic>) => ({ isOpen: !state.isOpen })),
    data: null,
    setData: (data: PatientPublic) => set(() => ({ data: data })),
  })
);

export default function EditPatientDialog(
  props: Pick<DialogState<PatientPublic>, "isOpen" | "data" | "toggleModal"> & {
    onUpdate: () => Promise<void>;
  }
) {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.toggleModal}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Изменить пациента</DialogTitle>
          <DialogDescription>
            Изменение информации о пациенте.
          </DialogDescription>
        </DialogHeader>
        <UpdatePatientForm patient={props.data} onUpdate={props.onUpdate} />
      </DialogContent>
    </Dialog>
  );
}
