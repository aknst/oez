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
import { patientsCreatePatient } from "@/client/services.gen"; // импортируем метод создания пациента

const patientFormSchema = z.object({
  full_name: z
    .string()
    .min(2, { message: "Имя пациента должно содержать не менее 2 символов." }),
  birth_date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Некорректная дата" }) // Проверка на корректность даты
    .optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

export function CreatePatientForm({
  className,
  onUpdate,
}: {
  className?: string;
  onUpdate: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      full_name: "",
      birth_date: "",
    },
    mode: "onChange",
  });

  // Преобразование строки в Date перед отправкой
  const handleSubmit = (data: PatientFormValues) => {
    const transformedData = {
      ...data,
      birth_date: data.birth_date
        ? new Date(data.birth_date).toISOString()
        : undefined, // Преобразуем строку в Date, а затем в ISO строку
    };
    onSubmit(transformedData);
  };

  async function onSubmit(data: PatientFormValues) {
    setIsLoading(true);

    try {
      await patientsCreatePatient({
        body: {
          ...data,
          birth_date: data.birth_date ? new Date(data.birth_date) : null, // Конвертируем строку в Date при отправке
        },
      });

      toast.success("Пациент успешно создан.");
    } catch (error) {
      console.log(error);
      toast.error("Не удалось создать пациента.");
    } finally {
      setIsLoading(false);
      await onUpdate();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)} // Используем кастомный handleSubmit
        className={cn("space-y-4", className)}>
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Полное имя</FormLabel>
              <FormControl>
                <Input placeholder="Иван Иванов" {...field} />
              </FormControl>
              <FormDescription>Введите полное имя пациента.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дата рождения</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                Выберите дату рождения пациента.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Создать пациента"
          )}
        </Button>
      </form>
    </Form>
  );
}
