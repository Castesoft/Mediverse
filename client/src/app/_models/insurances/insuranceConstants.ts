import { Validators } from "@angular/forms";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { Insurance } from "src/app/_models/insurances/insurance";


export const insuranceFormInfo: FormInfo<Insurance> = {
  file: { label: 'Archivo', type: 'file', validators: [Validators.required], },
  isMain: { label: 'Es principal', type: 'checkbox', validators: [Validators.required], title: '¿Establecer esta póliza como la principal?', helperText: 'Esta póliza aparecerá primero en la selección de pólizas al agendar una cita.' },
  medicalInsuranceCompany: { label: 'Aseguradora', type: 'typeahead', validators: [Validators.required] },
  policyNumber: { label: 'Número de póliza', type: 'text', validators: [Validators.required] },
} as FormInfo<Insurance>;
