import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usersUpdateUser } from "@/client/services.gen";
import { Checkbox } from "../ui/checkbox";
import { UserPublic } from "@/client/types.gen";

const userFormSchema = z.object({
  email: z.string().email("Некорректный адрес электронной почты").optional(),
  full_name: z
    .string()
    .min(2, { message: "Имя должно содержать не менее 2 символов." })
    .optional(),
  password: z.string().optional(),
  is_active: z.boolean().optional(),
  is_superuser: z.boolean().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

type UpdateUserFormProps = {
  user: UserPublic | null;
  className?: string;
  onUpdate: () => Promise<void>;
};

export function UpdateUserForm({
  user,
  className,
  onUpdate,
}: UpdateUserFormProps) {
  const [isPasswordChanging, setIsPasswordChanging] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || "",
      full_name: user?.full_name || "",
      is_active: user?.is_active,
      is_superuser: user?.is_superuser,
    },
    mode: "onChange",
  });

  async function onSubmit(data: UserFormValues) {
    setIsLoading(true);

    try {
      await usersUpdateUser({
        body: data,
        path: { user_id: user?.id || "" },
      });

      toast.success("Пользователь успешно обновлен.");
      await onUpdate();
    } catch (error) {
      toast.error("Не удалось обновить пользователя.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      form.register("password", {
        required: "Пароль обязателен",
        minLength: 8,
      });
    } else {
      form.unregister("password");
    }

    setIsPasswordChanging(checked);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Электронная почта</FormLabel>
              <FormControl>
                <Input placeholder="example@mail.com" {...field} />
              </FormControl>
              <FormDescription>
                Обновите адрес электронной почты пользователя.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Полное имя</FormLabel>
              <FormControl>
                <Input placeholder="Иван Иванов" {...field} />
              </FormControl>
              <FormDescription>
                Введите полное имя пользователя.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <Checkbox
            onCheckedChange={(checked) =>
              handleCheckboxChange(checked === true)
            }
            checked={isPasswordChanging}
          />
          <span className="text-sm">Изменить пароль</span>
        </div>

        {/* Поле для ввода пароля, если чекбокс отмечен */}
        {isPasswordChanging && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Новый пароль"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Введите новый пароль для пользователя.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-between gap-4">
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex gap-2 items-center space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Активный</FormLabel>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_superuser"
            render={({ field }) => (
              <FormItem className="flex gap-2 items-center space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Администратор</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Обновить пользователя"
          )}
        </Button>
      </form>
    </Form>
  );
}
