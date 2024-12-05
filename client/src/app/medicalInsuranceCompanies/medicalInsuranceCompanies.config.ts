import { Injectable } from "@angular/core";
import { MedicalInsuranceCompany } from "src/app/_models/medicalInsuranceCompanies/medicalInsuranceCompany";
import { medicalInsuranceCompanyColumns, medicalInsuranceCompanyDictionary } from "src/app/_models/medicalInsuranceCompanies/medicalInsuranceCompanyConstants";
import { MedicalInsuranceCompanyFiltersForm } from "src/app/_models/medicalInsuranceCompanies/medicalInsuranceCompanyFiltersForm";
import { MedicalInsuranceCompanyParams } from "src/app/_models/medicalInsuranceCompanies/medicalInsuranceCompanyParams";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";

@Injectable({
  providedIn: 'root',
})
export class MedicalInsuranceCompaniesService extends ServiceHelper<MedicalInsuranceCompany, MedicalInsuranceCompanyParams, MedicalInsuranceCompanyFiltersForm> {
  constructor() {
    super(MedicalInsuranceCompanyParams, 'medicalInsuranceCompanies', medicalInsuranceCompanyDictionary, medicalInsuranceCompanyColumns);
  }
}
