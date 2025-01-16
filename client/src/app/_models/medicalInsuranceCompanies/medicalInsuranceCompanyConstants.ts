import { Column, columnCode, columnCreatedAt, columnDescription, columnEnabled, columnId, columnName, columnVisible } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { MedicalInsuranceCompanyParams } from "src/app/_models/medicalInsuranceCompanies/medicalInsuranceCompanyParams";
import { MedicalInsuranceCompany } from "src/app/_models/medicalInsuranceCompanies/medicalInsuranceCompany";

export const medicalInsuranceCompanyDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'especialidad',
  'especialidades',
  'Especialidades',
  'medicalInsuranceCompanies',
);

export const medicalInsuranceCompanyColumns: Column[] = [
  columnId,
  columnCode,
  columnName,
  columnDescription,
  columnCreatedAt,
  columnVisible,
  columnEnabled,
];

export const medicalInsuranceCompanyFormInfo: FormInfo<MedicalInsuranceCompany> = {
  ...baseInfo,
} as FormInfo<MedicalInsuranceCompany>;

export const medicalInsuranceCompanyFiltersFormInfo: FormInfo<MedicalInsuranceCompanyParams> = {
  ...baseFilterFormInfo,
} as FormInfo<MedicalInsuranceCompanyParams>;
