import { PatientPublic } from "@/client/types.gen";

export default function PatientInfo({ patient }: { patient: PatientPublic }) {
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
