import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { usersDeleteUser, usersReadUsers } from "@/client/services.gen";
import { UserPublic } from "@/client/types.gen";
import { DataTable } from "@/components/ui/data-table";
import UpdateUserDialog, {
  useUserDialogState,
} from "@/components/dialogs/users/UpdateUserDialog";
import CreateUserDialog from "@/components/dialogs/users/CreateUserDialog";
import { toast } from "sonner";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export function UsersPage() {
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState<UserPublic[]>([]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await usersReadUsers();
      if (response) {
        setUsers(response.data?.data || []);
      }
    } catch (error) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadUsers();
  }, []);

  const { isOpen, toggleModal, data, setData } = useUserDialogState();

  const onUpdate = async () => {
    await loadUsers();
    toggleModal();
  };

  const userColumns: ColumnDef<UserPublic>[] = [
    {
      accessorKey: "full_name",
      meta: "ФИО",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="ФИО" />;
      },
      cell: ({ row }) => <div>{row.getValue("full_name")}</div>,
    },
    {
      meta: "Почта",
      accessorKey: "email",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Почта" />;
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      meta: "Активен",
      enableSorting: false,
      accessorKey: "is_active",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Активен" />;
      },
      cell: ({ row }) => {
        return row.getValue("is_active") ? (
          <Checkbox id="terms2" checked disabled />
        ) : (
          <Checkbox id="terms2" disabled />
        );
      },
    },
    {
      id: "is_superuser",
      meta: "Админ",
      accessorKey: "is_superuser",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Админ" />;
      },
      cell: ({ row }) => {
        return row.getValue("is_superuser") ? (
          <Checkbox id="terms2" checked disabled />
        ) : (
          <Checkbox id="terms2" disabled />
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
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
                    setData(user);
                    toggleModal();
                  }}>
                  Изменить
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      await usersDeleteUser({
                        path: { user_id: user?.id },
                      });

                      setUsers((prevUsers) =>
                        prevUsers.filter((u) => u.id !== user.id)
                      );

                      toast.success("Пользователь удален");
                    } catch (error) {
                      toast.error("Не удалось удалить пользователя");
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
      <CreateUserDialog onUpdate={loadUsers} />
      <UpdateUserDialog
        isOpen={isOpen}
        toggleModal={toggleModal}
        data={data}
        onUpdate={onUpdate}
      />
      <DataTable columns={userColumns} data={users} loading={loading} />
    </div>
  );
}
