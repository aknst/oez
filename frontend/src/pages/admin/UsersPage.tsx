import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  TableState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import {
  usersDeleteUser,
  usersReadUsers,
  usersUpdateUser,
} from "@/client/services.gen";
import { UserPublic, UserUpdate } from "@/client/types.gen";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import UpdateUserDialog, {
  useUserDialogState,
} from "@/components/dialogs/UpdateUserDialog";
import CreateUserDialog from "@/components/dialogs/CreateUserDialog";
import { toast } from "sonner";

export function UsersPage() {
  const [users, setUsers] = React.useState<UserPublic[]>([]);

  const loadUsers = async () => {
    try {
      const response = await usersReadUsers();
      if (response) {
        setUsers(response.data?.data || []);
      }
    } catch (error) {
      setUsers([]);
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
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            ФИО
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("full_name")}</div>,
    },
    {
      meta: "Почта",
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Почта
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      meta: "Активен",
      accessorKey: "is_active",
      header: () => <div>Активен</div>,
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
      header: () => <div>Админ</div>,
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
      <DataTable columns={userColumns} data={users} />
    </div>
  );
}
