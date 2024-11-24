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
  patientsDeletePatient,
  patientsReadPatients,
} from "@/client/services.gen";
import { PatientPublic } from "@/client/types.gen";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import CreatePatientDialog from "@/components/dialogs/patients/CreatePatientDialog";
import UpdatePatientDialog, {
  usePatientDialogState,
} from "@/components/dialogs/patients/UpdatePatientDialog";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export function PatientsPage() {
  const [loading, setLoading] = React.useState(false);
  const [patients, setPatients] = React.useState<PatientPublic[]>([]);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const response = await patientsReadPatients();
      if (response) {
        setPatients(response.data?.data || []);
      }
    } catch (error) {
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async () => {
    await loadPatients();
    toggleModal();
  };

  React.useEffect(() => {
    loadPatients();
  }, []);

  const { isOpen, toggleModal, data, setData } = usePatientDialogState();

  const patientColumns: ColumnDef<PatientPublic>[] = [
    {
      accessorKey: "full_name",
      meta: "ФИО",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="ФИО" />;
      },
      cell: ({ row }) => <div>{row.getValue("full_name")}</div>,
    },
    {
      accessorKey: "birth_date",
      meta: "Дата рождения (возраст)",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title="Дата рождения (возраст)"
          />
        );
      },
      cell: ({ row }) => {
        const birthDate = row.getValue("birth_date");

        if (
          !birthDate ||
          (typeof birthDate !== "string" && typeof birthDate !== "number")
        ) {
          return <div>Не указан</div>;
        }

        const date = new Date(birthDate);

        const formattedDate = `${String(date.getDate()).padStart(
          2,
          "0"
        )}.${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}.${date.getFullYear()}`;

        const age = new Date().getFullYear() - date.getFullYear();
        const isBirthdayThisYear =
          new Date().getMonth() < date.getMonth() ||
          (new Date().getMonth() === date.getMonth() &&
            new Date().getDate() < date.getDate());
        const calculatedAge = isBirthdayThisYear ? age - 1 : age;

        return (
          <div>
            {formattedDate} ({calculatedAge} лет)
          </div>
        );
      },
    },
    {
      accessorKey: "gender",
      meta: "Гендер",
      enableSorting: false,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Гендер" />;
      },
      cell: ({ row }) => {
        return (
          <div>{row.getValue("gender") == "male" ? "Мужчина" : "Женщина"}</div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const patient = row.original;
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
                    setData(patient);
                    toggleModal();
                  }}>
                  Изменить
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      await patientsDeletePatient({
                        path: { id: patient?.id },
                      });

                      setPatients((prev) =>
                        prev.filter((u) => u.id !== patient.id)
                      );

                      toast.success("Пациент удален");
                    } catch (error) {
                      toast.error("Не удалось удалить пациента");
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
      <CreatePatientDialog onUpdate={loadPatients} />
      <UpdatePatientDialog
        isOpen={isOpen}
        toggleModal={toggleModal}
        data={data}
        onUpdate={onUpdate}
      />
      <DataTable columns={patientColumns} data={patients} loading={loading} />
    </div>
  );
}
