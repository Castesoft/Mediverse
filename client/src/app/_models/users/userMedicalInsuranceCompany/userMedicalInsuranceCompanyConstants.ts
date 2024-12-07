import { documentFormInfo } from "src/app/_models/documents/documentConstants";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { UserMedicalInsuranceCompany } from "src/app/_models/users/userMedicalInsuranceCompany/userMedicalInsuranceCompany";


export const userMedicalInsuranceCompanyFormInfo: FormInfo<UserMedicalInsuranceCompany> = {
  document: documentFormInfo,
  id: { label: 'Id', type: 'number' },
  isMain: { label: 'Es principal', type: 'checkbox' },
  policyNumber: { label: 'Número de póliza', type: 'text' },
  medicalInsuranceCompany: { label: 'Aseguradora', type: 'typeahead' },
} as FormInfo<UserMedicalInsuranceCompany>;
