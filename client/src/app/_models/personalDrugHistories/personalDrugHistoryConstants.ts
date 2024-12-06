import { Validators } from "@angular/forms";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { PersonalDrugHistory } from "src/app/_models/personalDrugHistories/personalDrugHistory";


export const personalDrugHistoryFormInfo: FormInfo<PersonalDrugHistory> = {
  id: { label: 'ID', type: 'number' },
  consumptionLevel: { label: 'Nivel de consumo', type: 'select', showCodeSpan: false },
  endAge: { label: 'Edad de cese', type: 'number', validators: [Validators.required, Validators.min(0), Validators.max(150)] },
  isCurrent: { label: 'Consumo actual', type: 'checkbox' },
  startAge: { label: 'Edad de inicio', type: 'number', validators: [Validators.required, Validators.min(0), Validators.max(150)] },
  substance: { label: 'Sustancia', type: 'select', showCodeSpan: false },
} as FormInfo<PersonalDrugHistory>;
