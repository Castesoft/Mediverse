import { documentFormInfo } from "src/app/_models/documents/documentConstants";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { MedicalLicense } from "src/app/_models/medicalLicenses/medicalLicense";


export const medicalLicenseFormInfo: FormInfo<MedicalLicense> = {
  document: documentFormInfo,
  isMain: { label: 'Es principal', type: 'checkbox' },
  licenseNumber: { label: 'Número de licencia', type: 'text' },
  specialtyLicense: { label: 'Especialidad de licencia', type: 'text' },
  specialtyId: { label: 'ID de especialidad', type: 'number' },
  specialtyName: { label: 'Nombre de especialidad', type: 'text' },
} as FormInfo<MedicalLicense>;
