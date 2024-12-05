import { EntityParams } from "src/app/_models/base/entityParams";
import { MedicalInsuranceCompany } from "src/app/_models/medicalInsuranceCompanies/medicalInsuranceCompany";


export class MedicalInsuranceCompanyParams extends EntityParams<MedicalInsuranceCompany> {
  constructor(key: string | null) {
    super(key);
  }
}
