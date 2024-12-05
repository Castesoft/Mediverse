import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { MedicalInsuranceCompany } from "src/app/_models/medicalInsuranceCompanies/medicalInsuranceCompany";
import { medicalInsuranceCompanyFormInfo } from "src/app/_models/medicalInsuranceCompanies/medicalInsuranceCompanyConstants";

export class MedicalInsuranceCompanyForm extends FormGroup2<MedicalInsuranceCompany> {
  constructor() {
    super(MedicalInsuranceCompany, new MedicalInsuranceCompany(), medicalInsuranceCompanyFormInfo);
  }
}
