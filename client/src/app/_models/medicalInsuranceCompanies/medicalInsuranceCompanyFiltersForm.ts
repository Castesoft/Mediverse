import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { medicalInsuranceCompanyFiltersFormInfo } from "src/app/_models/medicalInsuranceCompanies/medicalInsuranceCompanyConstants";
import { MedicalInsuranceCompanyParams } from "src/app/_models/medicalInsuranceCompanies/medicalInsuranceCompanyParams";

export class MedicalInsuranceCompanyFiltersForm extends FormGroup2<MedicalInsuranceCompanyParams> {
  constructor() {
    super(MedicalInsuranceCompanyParams as any, new MedicalInsuranceCompanyParams(createId()), medicalInsuranceCompanyFiltersFormInfo);
  }
}
