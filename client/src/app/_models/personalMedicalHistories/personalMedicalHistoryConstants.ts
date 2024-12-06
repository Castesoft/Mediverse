import { Validators } from "@angular/forms";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { PersonalMedicalHistory } from "src/app/_models/personalMedicalHistories/personalMedicalHistory";


export const personalMedicalHistoryFormInfo: FormInfo<PersonalMedicalHistory> = {
  id: { label: 'ID', type: 'number' },
  description: { label: 'Descripción', type: 'text', validators: [Validators.required] },
  disease: { label: 'Enfermedad', type: 'select', showCodeSpan: false },
} as FormInfo<PersonalMedicalHistory>;
