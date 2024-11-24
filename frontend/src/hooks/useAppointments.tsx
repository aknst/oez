import { appointmentsReadAppointments } from "@/client/services.gen";
import { AppointmentPublic } from "@/client/types.gen";
import { useState, useEffect } from "react";

export function useAppointments(disease_id: string) {
  const [appointments, setAppointments] = useState<AppointmentPublic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!disease_id) {
      setAppointments([]);
      setLoading(false);
      setError(null);
      return;
    }
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await appointmentsReadAppointments({
          query: {
            disease_id,
          },
        });
        if (response) {
          setAppointments(response.data?.data || []);
        }
      } catch (err) {
        setError(err as Error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [disease_id]);

  return { appointments, loading, error };
}
