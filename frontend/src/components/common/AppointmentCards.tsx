import { AppointmentPublic } from "@/client/types.gen";
import { AppointmentCard } from "./AppointmentCard";

type AppointmentCardsProps = {
  appointments: AppointmentPublic[] | null | undefined;
};

export function AppointmentCards({ appointments }: AppointmentCardsProps) {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No appointments available.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {appointments.map((appointment) => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
}
