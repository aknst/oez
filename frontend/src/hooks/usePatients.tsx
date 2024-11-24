import { patientsReadPatients } from "@/client";
import { PatientPublic } from "@/client/types.gen";
import { useEffect, useState } from "react";

export function usePatients() {
  const [patients, setPatients] = useState<PatientPublic[]>([]);
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await patientsReadPatients();
        setPatients(response.data?.data || []);
      } catch (error) {
        setPatients([]);
      }
    };
    fetchPatients();
  }, []);
  return patients;
}
