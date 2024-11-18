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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea"; // Для текстовых полей
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  diseasesReadDiseases,
  patientsReadPatients,
} from "@/client/services.gen";
import { DiseasePublic, PatientPublic } from "@/client";
import { Checkbox } from "../ui/checkbox";

const appointmentFormSchema = z.object({
  complaints: z.string().optional(),
  anamnesis: z.string().optional(),
  disease_day: z.number().int().optional(),
  objective_status: z.string().optional(),
  patient_id: z.string({
    required_error: "Please select a language.",
  }),
  disease_id: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

type UpdateAppointmentFormProps = {
  appointment: null;
  className?: string;
  onUpdate: () => Promise<void>;
};

function PatientInfo({ patient }: { patient: PatientPublic }) {
  const calculateAge = (birthDate?: Date | null): string | null => {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();
    const isBirthdayPassed =
      month > 0 || (month === 0 && today.getDate() >= birth.getDate());

    return isBirthdayPassed ? `${age} лет` : `${age - 1} лет`;
  };

  const age = calculateAge(patient.birth_date);

  return (
    <div>
      {patient.full_name}
      {age ? `, ${age}` : ""}
    </div>
  );
}

export function AppointmentForm({
  className,
  onUpdate,
}: UpdateAppointmentFormProps) {
  const [isNewDisease, setIsNewDisease] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [patients, setPatients] = React.useState<PatientPublic[]>([]);
  const [diseases, setDiseases] = React.useState<DiseasePublic[]>([]);

  const loadPatients = async () => {
    try {
      const response = await patientsReadPatients();
      if (response) {
        setPatients(response.data?.data || []);
      }
    } catch (error) {
      setPatients([]);
    }
  };

  const loadDiseases = async () => {
    try {
      const response = await diseasesReadDiseases();
      if (response) {
        setDiseases(response.data?.data || []);
      }
    } catch (error) {
      setDiseases([]);
    }
  };

  React.useEffect(() => {
    loadPatients();
  }, []);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      complaints: "",
      anamnesis: "",
      objective_status: "",
    },
    mode: "onChange",
  });

  const selectedPatientId = form.watch("patient_id");

  async function onSubmit(data: AppointmentFormValues) {
    setIsLoading(true);

    try {
      alert(data.patient_id);

      toast.success("Прием успешно обновлен.");
      await onUpdate();
    } catch (error) {
      toast.error("Не удалось обновить прием.");
    } finally {
      setIsLoading(false);
    }
  }

  const [open, setOpen] = React.useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      form.register("disease_id", {
        required: "Пароль обязателен",
        minLength: 8,
      });
    } else {
      form.unregister("disease_id");
    }

    setIsNewDisease(checked);
  };

  React.useEffect(() => {
    if (isNewDisease && selectedPatientId) {
      loadDiseases();
    }
  }, [isNewDisease, selectedPatientId]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}>
        <div className="flex flex-wrap gap-4">
          <FormField
            control={form.control}
            name="patient_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Пациент</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}>
                        {field.value ? (
                          patients.find(
                            (patient) => patient.id === field.value
                          ) ? (
                            <PatientInfo
                              patient={
                                patients.find(
                                  (patient) => patient.id === field.value
                                )!
                              }
                            />
                          ) : (
                            <span>Пациент не найден</span>
                          )
                        ) : (
                          <span>Выбрать пациента</span>
                        )}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Поиск пациента..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Пациент не найден.</CommandEmpty>
                        <CommandGroup>
                          {patients.map((patient) => (
                            <CommandItem
                              value={patient.full_name}
                              key={patient.id}
                              onSelect={() => {
                                form.setValue("patient_id", patient.id);
                                setOpen(false);
                              }}>
                              <PatientInfo patient={patient} />
                              <Check
                                className={cn(
                                  "ml-auto",
                                  patient.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Выберите пациета или добавьте нового.
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
              checked={isNewDisease}
            />
            <span className="text-sm">Повторный прием</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {isNewDisease && (
            <FormField
              control={form.control}
              name="disease_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Болезнь</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}>
                          {field.value ? (
                            diseases.find(
                              (disease) => disease.id === field.value
                            ) ? (
                              <PatientInfo
                                patient={
                                  patients.find(
                                    (disease) => disease.id === field.value
                                  )!
                                }
                              />
                            ) : (
                              <span>Болезни не найдены</span>
                            )
                          ) : (
                            <span>Выбрать болезнь</span>
                          )}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Поиск пациента..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No framework found.</CommandEmpty>
                          <CommandGroup>
                            {diseases.map((disease) => (
                              <CommandItem
                                value={disease.id}
                                key={disease.id}
                                onSelect={() => {
                                  form.setValue("disease_id", disease.id);
                                  setOpen(false);
                                }}>
                                {disease.id}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    disease.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Выберите пациета или добавьте нового.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="disease_day"
            render={({ field }) => (
              <FormItem>
                <FormLabel>День заболевания</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="День заболевания"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Укажите день начала заболевания.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="complaints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Жалобы</FormLabel>
              <FormControl>
                <Textarea placeholder="Опишите жалобы пациента..." {...field} />
              </FormControl>
              <FormDescription>
                Укажите жалобы пациента на момент консультации.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="anamnesis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Анамнез заболевания</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Опишите анамнез заболевания..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Введите информацию об анамнезе заболевания пациента.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="objective_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Объективный статус</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Опишите объективный статус пациента..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Введите объективный статус пациента на момент консультации.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Получить рекомендации"
          )}
        </Button>
      </form>
    </Form>
  );
}
