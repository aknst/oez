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
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { patientsCreatePatient } from "@/client/services.gen"; // импортируем метод создания пациента
import { Gender } from "@/client/types.gen";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

const patientFormSchema = z.object({
  full_name: z
    .string()
    .min(2, { message: "Имя пациента должно содержать не менее 2 символов." }),
  birth_date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Некорректная дата" }) // Проверка на корректность даты
    .optional(),
  gender: z.enum(["male", "female"]),
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
      gender: "male" as Gender,
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
      await onUpdate();
    } catch (error) {
      toast.error("Не удалось создать пациента.");
    } finally {
      setIsLoading(false);
      form.reset();
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
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Гендер</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите гендер" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Мужчина</SelectItem>
                  <SelectItem value="female">Женщина</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Укажите пол пациента</FormDescription>
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

        <Button type="submit">
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
