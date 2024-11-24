import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import {
  appointmentsDeleteAppointment,
  appointmentsReadAppointments,
} from "@/client/services.gen";
import { AppointmentPublic } from "@/client/types.gen";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import UpdateAppointmentDialog, {
  useAppointmentDialogState,
} from "@/components/dialogs/appointments/UpdateAppointmentDialog";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/lib/utils";

export function HistoryPage() {
  const [loading, setLoading] = React.useState(false);
  const [appointments, setaAppointments] = React.useState<AppointmentPublic[]>(
    []
  );

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentsReadAppointments();
      if (response) {
        setaAppointments(response.data?.data || []);
      }
    } catch (error) {
      setaAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async () => {
    await loadAppointments();
    toggleModal();
  };

  React.useEffect(() => {
    loadAppointments();
  }, []);

  const { isOpen, toggleModal, data, setData } = useAppointmentDialogState();

  const appointmentColumns: ColumnDef<AppointmentPublic>[] = [
    {
      accessorKey: "complaints",
      enableSorting: false,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Жалобы" />;
      },
      cell: ({ row }) => <div>{row.getValue("complaints") ?? "N/A"}</div>,
    },
    {
      accessorKey: "anamnesis",
      enableSorting: false,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Анамнез" />;
      },
      cell: ({ row }) => <div>{row.getValue("anamnesis") ?? "N/A"}</div>,
    },
    {
      accessorKey: "objective_status",
      enableSorting: false,
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="Объективный статус" />
        );
      },
      cell: ({ row }) => <div>{row.getValue("objective_status") ?? "N/A"}</div>,
    },
    {
      accessorKey: "doctor_diagnosis",
      enableSorting: false,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Диагноз" />;
      },
      cell: ({ row }) => <div>{row.getValue("doctor_diagnosis") ?? "N/A"}</div>,
    },
    {
      accessorKey: "doctor_recommendations",
      enableSorting: false,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Рекомендациии" />;
      },
      cell: ({ row }) =>
        row.getValue("doctor_recommendations") ? (
          <Textarea
            className="h-36 w-72 rounded-md border"
            readOnly
            value={row.getValue("doctor_recommendations") ?? "N/A"}></Textarea>
        ) : null,
    },
    {
      accessorKey: "nlp_diagnosis",
      enableSorting: false,
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Диагноз от NLP модели"
          />
        );
      },
      cell: ({ row }) => <div>{row.getValue("nlp_diagnosis") ?? "N/A"}</div>,
    },
    {
      accessorKey: "nlp_recommendations",
      enableSorting: false,
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Рекомендации от NLP модели"
          />
        );
      },
      cell: ({ row }) => {
        return (
          <Textarea
            className="h-36 w-72 rounded-md border"
            readOnly
            value={row.getValue("nlp_recommendations") ?? "N/A"}></Textarea>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Дата" />;
      },
      cell: ({ row }) => {
        const createdAt = row.getValue("created_at");

        if (!createdAt) {
          return <div>N/A</div>;
        }
        return `${formatDateTime(createdAt as string)}`;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setData(appointment);
                    toggleModal();
                  }}>
                  Изменить
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      await appointmentsDeleteAppointment({
                        path: { id: appointment?.id },
                      });

                      setaAppointments((prev) =>
                        prev.filter((u) => u.id !== appointment.id)
                      );

                      toast.success("Запись о приеме удалена");
                    } catch (error) {
                      toast.error("Не удалось удалить запись о приеме");
                    }
                  }}>
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  return (
    <div className="w-full p-4 space-y-4">
      <UpdateAppointmentDialog
        isOpen={isOpen}
        toggleModal={toggleModal}
        data={data}
        onUpdate={onUpdate}
      />

      <DataTable
        columns={appointmentColumns}
        data={appointments}
        loading={loading}
      />
    </div>
  );
}
