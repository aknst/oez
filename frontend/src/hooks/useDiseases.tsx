import { DiseasePublic, diseasesReadDiseases } from "@/client";
import { useEffect, useState } from "react";

export function useDiseases(
  patientId: string | null | undefined,
  refreshKey?: number
) {
  const [diseases, setDiseases] = useState<DiseasePublic[]>([]);
  useEffect(() => {
    if (patientId) {
      const fetchDiseases = async () => {
        try {
          const response = await diseasesReadDiseases({
            query: { patient_id: patientId, sort_order: "desc" },
          });
          setDiseases(response.data?.data || []);
        } catch (error) {
          setDiseases([]);
        }
      };
      fetchDiseases();
    }
  }, [patientId, refreshKey]);
  return diseases;
}
