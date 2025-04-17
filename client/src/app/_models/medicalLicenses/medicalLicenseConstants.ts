import { Validators } from '@angular/forms';
import { documentFormInfo } from "src/app/_models/documents/documentConstants";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { MedicalLicense } from "src/app/_models/medicalLicenses/medicalLicense";


export const medicalLicenseFormInfo: FormInfo<MedicalLicense> = {
  document: documentFormInfo,
  isMain: { label: 'Es principal', type: 'checkbox' },
  licenseNumber: {
    label: 'Número de licencia',
    type: 'text',
    validators: [ Validators.required, Validators.minLength(7), Validators.maxLength(7), ]
  },
  specialtyLicense: {
    label: 'Especialidad de licencia',
    type: 'text',
    validators: [ Validators.required, Validators.minLength(7), Validators.maxLength(7), ],
  },
  specialtyId: { label: 'ID de especialidad', type: 'number' },
  specialtyName: { label: 'Nombre de especialidad', type: 'text' },
  file: { label: 'Archivo', type: 'file', validators: [ Validators.required ], style: 'material', },
  specialty: { label: 'Especialidad', type: 'typeahead', validators: [ Validators.required ] },
} as FormInfo<MedicalLicense>;
