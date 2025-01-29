import { Validators } from "@angular/forms";
import { sexOptions, handDominanceOptions, companionFormInfo } from "src/app/_models/companions/companionConstants";
import { familyMedicalHistoryFormInfo } from "src/app/_models/familyMedicalHistories/familyMedicalHistoryConstants";
import { familyMemberFormInfo } from "src/app/_models/familyMembers/familyMemberConstants";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { MedicalRecord } from "src/app/_models/medicalRecords/medicalRecord";
import { personalDrugHistoryFormInfo } from "src/app/_models/personalDrugHistories/personalDrugHistoryConstants";
import {
  personalMedicalHistoryFormInfo
} from "src/app/_models/personalMedicalHistories/personalMedicalHistoryConstants";

export const medicalRecordFormInfo: FormInfo<MedicalRecord> = {
  patientName: { label: 'Nombre completo', type: 'text', validators: [ Validators.required, Validators.minLength(3) ] },
  age: { label: 'Edad', type: 'number', validators: [ Validators.required, Validators.min(0), Validators.max(150) ] },
  sex: {
    label: 'Sexo',
    type: 'radio',
    showCodeSpan: false,
    selectOptions: sexOptions,
    validators: [ Validators.required, ]
  },
  birthPlace: { label: 'Lugar de nacimiento', type: 'text', orientation: 'block', validators: [ Validators.required ] },
  birthDate: { label: 'Fecha de nacimiento', type: 'date', orientation: 'block', validators: [ Validators.required ] },
  educationLevel: {
    label: 'Nivel de estudios',
    type: 'select',
    showCodeSpan: false,
    validators: [ Validators.required, ]
  },
  yearsOfSchooling: {
    label: 'Años de escolaridad',
    type: 'number',
    validators: [ Validators.required, Validators.min(0), Validators.max(100) ]
  },
  occupation: { label: 'Ocupación', type: 'select', showCodeSpan: false, validators: [ Validators.required, ] },
  handDominance: {
    label: 'Dominancia manual',
    type: 'select',
    showCodeSpan: false,
    selectOptions: handDominanceOptions,
    validators: [ Validators.required, ]
  },
  maritalStatus: { label: 'Estado civil', type: 'select', showCodeSpan: false, validators: [ Validators.required, ] },
  currentLivingSituation: { label: 'Con quien vive actualmente', type: 'text', validators: [ Validators.required ] },
  currentAddress: { label: 'Domicilio actual', type: 'text', validators: [ Validators.required ] },
  homePhone: { label: 'Teléfono de casa', type: 'text' },
  mobilePhone: { label: 'Teléfono móvil', type: 'text', validators: [ Validators.required ] },
  email: { label: 'Correo electrónico', type: 'text', validators: [ Validators.required, Validators.email ] },
  hasCompanion: { label: 'Asiste acompañado', type: 'slideToggle' },
  economicDependence: { label: 'Dependencia económica', type: 'text' },
  usesGlassesOrHearingAid: { label: 'Usa lentes o ayuda auditiva', type: 'slideToggle' },
  colorBlindness: { label: 'Daltonismo', type: 'select', showCodeSpan: false },

  companion: companionFormInfo,

  familyMedicalHistory: familyMedicalHistoryFormInfo,
  familyMembers: familyMemberFormInfo,
  personalDrugHistory: personalDrugHistoryFormInfo,
  personalMedicalHistory: personalMedicalHistoryFormInfo,

  comments: { label: 'Comentarios', type: 'textarea', rows: 10, showLabel: false },
} as FormInfo<MedicalRecord>;
