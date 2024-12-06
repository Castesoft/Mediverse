import { FamilyMedicalHistory } from "src/app/_models/familyMedicalHistories/familyMedicalHistory";
import { FormInfo } from "src/app/_models/forms/formTypes";


export const familyMedicalHistoryFormInfo: FormInfo<FamilyMedicalHistory> = {
  id: { label: 'ID', type: 'number' },
  description: { label: 'Descripción', type: 'text' },
  disease: { label: 'Enfermedad', type: 'select', showCodeSpan: false },
  relativeType: { label: 'Parentesco', type: 'select', showCodeSpan: false },
} as FormInfo<FamilyMedicalHistory>;
