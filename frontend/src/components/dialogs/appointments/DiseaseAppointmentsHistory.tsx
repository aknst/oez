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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppointments } from "@/hooks/useAppointments";
import { AppointmentCards } from "@/components/common/AppointmentCards";

type DiseaseAppointmentsHistoryProps = {
  diseaseId?: string | null; // Make diseaseId optional
};

export default function DiseaseAppointmentsHistory({
  diseaseId,
}: DiseaseAppointmentsHistoryProps) {
  const [open, setOpen] = useState(false);
  const isDisabled = !diseaseId || diseaseId === "";
  const { appointments, loading, error } = useAppointments(diseaseId || ""); // Pass diseaseId to hook

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isDisabled}>
          История приемов в течение болезни
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80%]">
        <DialogHeader>
          <DialogTitle className="text-2xl">История приемов</DialogTitle>
          <DialogDescription>
            Здесь отображаются все приемы пациента в течение болезни.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80dvh] pr-4 pb-4">
          {loading ? (
            <div className="text-center text-muted-foreground">Загрузка...</div>
          ) : error ? (
            <div className="text-center text-muted-foreground">
              Ошибка при загрузке данных.
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center text-muted-foreground">
              Нет доступных приемов.
            </div>
          ) : (
            <AppointmentCards appointments={appointments} />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
