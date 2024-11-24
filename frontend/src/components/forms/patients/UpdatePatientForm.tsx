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
import { patientsUpdatePatient } from "@/client/services.gen";
import { Gender, PatientPublic } from "@/client/types.gen";
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
    .min(2, { message: "Имя должно содержать не менее 2 символов." })
    .optional(),
  birth_date: z.string().optional(),
  gender: z.enum(["male", "female"]),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

type UpdatePatientFormProps = {
  patient: PatientPublic | null;
  className?: string;
  onUpdate: () => Promise<void>;
};

export function UpdatePatientForm({
  patient,
  className,
  onUpdate,
}: UpdatePatientFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      full_name: patient?.full_name || "",
      birth_date: String(patient?.birth_date),
      gender: patient?.gender,
    },
    mode: "onChange",
  });

  async function onSubmit(data: PatientFormValues) {
    setIsLoading(true);

    data.gender = data.gender as Gender;

    try {
      await patientsUpdatePatient({
        body: {
          ...data,
          birth_date: data.birth_date ? new Date(data.birth_date) : null, // Конвертируем строку в Date при отправке
        },
        path: { id: patient?.id || "" },
      });
      toast.success("Пациент успешно обновлен.");
      await onUpdate();
    } catch (error) {
      toast.error("Не удалось обновить пациента.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
              <FormDescription>Укажите дату рождения пациента.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Обновить пациента"
          )}
        </Button>
      </form>
    </Form>
  );
}
