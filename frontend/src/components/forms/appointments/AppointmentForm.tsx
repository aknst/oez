import { usePatients } from "@/hooks/usePatients";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { SelectablePopover } from "@/components/common/SelectablePopover";
import { cn, formatDateTime } from "@/lib/utils";
import PatientInfo from "./PatientInfo";
import { useDiseases } from "@/hooks/useDiseases";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AppointmentPublic,
  appointmentsCreateAppointment,
  appointmentsUpdateAppointment,
  modelsModelInference,
  modelsReadRecs,
} from "@/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const appointmentFormSchema = z.object({
  id: z.string().optional(),
  complaints: z.string().min(2, "Пожалуйста, введите жалобы"),
  anamnesis: z.string().optional(),
  objective_status: z.string().optional(),
  patient_id: z
    .string({ required_error: "Пожалуйста, выберите пациента" })
    .uuid({
      message: "Пожалуйста, выберите пациента",
    })
    .nullable(),
  disease_id: z.string().nullable(),
  nlp_diagnosis: z.string().optional(),
  nlp_recommendations: z.string().optional(),
  doctor_diagnosis: z.string().optional(),
  doctor_recommendations: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

type AppointmentFormProps = {
  appointment?: AppointmentPublic;
  selectedModel?: string;
  onUpdate?: (data: AppointmentFormValues) => void;
  className?: string;
};

export function AppointmentForm({
  appointment,
  selectedModel,
  onUpdate,
  className,
}: AppointmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [createdAppointmentId, setCreatedAppointmentId] = useState<
    string | null
  >(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [mode, setMode] = useState<"create" | "edit" | "view">(
    appointment ? "view" : "create"
  );

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      complaints: appointment?.complaints ?? "",
      anamnesis: appointment?.anamnesis ?? "",
      objective_status: appointment?.objective_status ?? "",
      patient_id: appointment?.patient_id ?? null,
      disease_id: appointment?.disease_id ?? null,
      nlp_diagnosis: appointment?.nlp_diagnosis ?? "",
      nlp_recommendations: appointment?.nlp_recommendations ?? "",
      doctor_diagnosis: appointment?.doctor_diagnosis ?? "",
      doctor_recommendations: appointment?.doctor_recommendations ?? "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((data: any) => {
      if (onUpdate) onUpdate(data);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const patients = usePatients();
  const selectedPatientId = form.watch("patient_id");
  const [isNewDisease, setIsNewDisease] = useState(
    appointment?.disease_id ? true : false
  );

  const diseases = useDiseases(selectedPatientId, refreshKey);

  const handleModeChange = (newMode: "create" | "edit" | "view") => {
    setMode(newMode);
  };

  const handleCancel = () => {
    handleModeChange("view");
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      form.register("disease_id", {
        value: null,
      });
    } else {
      form.unregister("disease_id");
      form.setValue("disease_id", null);
    }

    setIsNewDisease(checked);
  };

  const onInference = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const isValid = await form.trigger([
        "complaints",
        "anamnesis",
        "objective_status",
        "patient_id",
        "disease_id",
      ]);
      if (!isValid) {
        return;
      }
      if (!selectedModel) {
        return;
      }

      const inferenceResult = await modelsModelInference({
        path: {
          model: selectedModel,
        },
        body: form.getValues(),
      });
      form.setValue("nlp_diagnosis", inferenceResult.data?.result);

      if (inferenceResult.data?.result) {
        const recommendations = await modelsReadRecs({
          query: {
            label: inferenceResult.data?.result,
          },
        });
        form.setValue("nlp_recommendations", recommendations.data?.result);
      }
    } catch (error) {
      console.error("Ошибка при получении рекомендаций:", error);
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit(data: AppointmentFormValues) {
    setSubmitLoading(true);

    try {
      if (mode === "create") {
        if (form.getValues("patient_id") === null) {
          toast.error("Пожалуйста, укажите пациента");
          return;
        }
        const response = await appointmentsCreateAppointment({
          body: data,
        });
        const newAppointmentId = response.data?.id;
        const newDiseaseId = response.data?.disease_id;

        if (newAppointmentId) setCreatedAppointmentId(newAppointmentId);
        toast.success("Прием успешно создан.");
        form.setValue("id", newAppointmentId);
        if (newDiseaseId) {
          form.setValue("disease_id", newDiseaseId);
        }
        setRefreshKey((prev) => prev + 1);
        handleModeChange("view");
      } else if (mode === "edit" && (appointment?.id || createdAppointmentId)) {
        const appointmentId = appointment?.id || createdAppointmentId;
        if (appointmentId) {
          await appointmentsUpdateAppointment({
            path: { id: appointmentId },
            body: data,
          });
          setRefreshKey((prev) => prev + 1);
          toast.success("Прием успешно обновлен.");
          handleModeChange("view");
        }
      }
    } catch (error) {
      toast.error("Не удалось обновить прием.");
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn(
          "grid grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1",
          className
        )}>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <FormField
              control={form.control}
              name="patient_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Пациент</FormLabel>
                  <SelectablePopover
                    items={patients}
                    field={field}
                    form={form}
                    placeholder="Выбрать пациента"
                    onSelect={() => form.setValue("disease_id", null)}
                    renderItem={(patient) => <PatientInfo patient={patient} />}
                    disabled={mode === "view" || mode === "edit"}
                  />
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
                disabled={mode === "view" || mode === "edit"}
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
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Болезнь</FormLabel>
                    <SelectablePopover
                      items={diseases}
                      field={field}
                      form={form}
                      placeholder="Выбрать болезнь"
                      onSelect={() => {}}
                      renderItem={(disease) => (
                        <span className="truncate">
                          {disease.last_diagnosis} (
                          {formatDateTime(disease.updated_at)})
                        </span>
                      )}
                      buttonClassName="w-full	"
                      disabled={mode === "view"}
                    />
                    <FormDescription>
                      Выберите болезнь, в скобках указано время последнего
                      приема в рамках болезни.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="complaints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Жалобы</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Опишите жалобы пациента..."
                    {...field}
                    readOnly={mode === "view"}
                  />
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
                    readOnly={mode === "view"}
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
                    readOnly={mode === "view"}
                  />
                </FormControl>
                <FormDescription>
                  Введите объективный статус пациента на момент консультации.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {selectedModel && (
            <Button
              type="button"
              onClick={onInference}
              disabled={isLoading || mode === "view"}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Получение рекомендаций...
                </>
              ) : (
                "Получить рекомендации"
              )}
            </Button>
          )}
        </div>
        <div className="space-y-4 lg:flex lg:flex-col lg:justify-between ">
          <div className="space-y-4">
            <div className="space-y-4 p-4 border rounded-md shadow-lg	">
              <FormField
                control={form.control}
                name="nlp_diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Диагноз от NLP модели</FormLabel>
                    <FormControl>
                      <Textarea readOnly placeholder="" {...field} />
                    </FormControl>
                    <FormDescription>
                      Здесь отображается диагноз, автоматически сгенерированный
                      системой NLP.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nlp_recommendations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Рекомендации от NLP модели</FormLabel>
                    <FormControl>
                      <Textarea
                        readOnly
                        className="h-32"
                        placeholder=""
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Здесь отображаются рекомендации по лечению, предложенные
                      системой NLP.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="doctor_diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center flex-wrap gap-2">
                    Диагноз врача
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        disabled={mode === "view"}
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          form.setValue(
                            "doctor_diagnosis",
                            form.getValues("nlp_diagnosis")
                          );
                        }}>
                        Вставить диагноз NLP
                      </Button>
                      {isNewDisease && (
                        <Button
                          disabled={mode === "view"}
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            let diseaseId = form.getValues("disease_id");
                            const selectedDisease = diseases.find(
                              (disease) => disease.id === diseaseId
                            );
                            const lastValue = selectedDisease
                              ? selectedDisease.last_diagnosis
                              : null;
                            if (lastValue)
                              form.setValue("doctor_diagnosis", lastValue);
                          }}>
                          Вставить предыдущий диагноз
                        </Button>
                      )}
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Введите диагноз"
                      {...field}
                      readOnly={mode === "view"}
                    />
                  </FormControl>
                  {/* <FormDescription>Укажите диагноз.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doctor_recommendations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Рекомендации врача</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Введите рекомендации"
                      {...field}
                      readOnly={mode === "view"}
                    />
                  </FormControl>
                  {/* <FormDescription>
                    Укажите рекомендации по лечению.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end mt-auto gap-4">
            {mode === "edit" && (
              <Button onClick={handleCancel}>В режим просмотра</Button>
            )}
            {mode === "create" || mode === "edit" ? (
              <Button
                disabled={submitLoading}
                type="submit"
                onClick={form.handleSubmit(onSubmit)}>
                Сохранить прием
              </Button>
            ) : (
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  handleModeChange("edit");
                }}>
                Изменить прием
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
