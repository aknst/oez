import { AppointmentPublic } from "@/client/types.gen";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn, formatDateTime } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

const AppointmentDetail = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <div>
      <p className="mt-4 scroll-m-20 border-b pb-1 font-semibold tracking-tight transition-colors">
        {title}:
      </p>
      <p className="leading-7">{content}</p>
    </div>
  );
};

type CardProps = React.ComponentProps<typeof Card>;

export function AppointmentCard({
  appointment,
  className,
  ...props
}: { appointment: AppointmentPublic } & CardProps) {
  const cardTitle = `Прием от ${formatDateTime(appointment.created_at)}`;
  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader className="py-4 pb-0">
        <CardTitle className="text-lg">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-2">
          {appointment.complaints && (
            <AppointmentDetail
              title="Жалобы"
              content={appointment.complaints}
            />
          )}
          {appointment.anamnesis && (
            <AppointmentDetail
              title="Анамнез"
              content={appointment.anamnesis}
            />
          )}
          {appointment.objective_status && (
            <AppointmentDetail
              title="Объективный статус"
              content={appointment.objective_status}
            />
          )}
          {appointment.doctor_diagnosis && (
            <AppointmentDetail
              title="Диагноз врача"
              content={appointment.doctor_diagnosis}
            />
          )}
          {appointment.doctor_recommendations && (
            <AppointmentDetail
              title="Рекомендации врача"
              content={appointment.doctor_recommendations}
            />
          )}
          {appointment.nlp_diagnosis && (
            <AppointmentDetail
              title="Диагноз от NLP модели"
              content={appointment.nlp_diagnosis}
            />
          )}
          {appointment.nlp_recommendations && (
            <div>
              <p className="mt-4 scroll-m-20 border-b pb-1 font-semibold tracking-tight transition-colors mb-2">
                Рекомендации от NLP модели:
              </p>
              <Textarea
                className="h-36"
                readOnly
                value={appointment.nlp_recommendations}></Textarea>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
