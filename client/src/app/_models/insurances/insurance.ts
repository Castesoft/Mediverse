import { SelectOption } from "src/app/_models/base/selectOption";


export class Insurance {
  medicalInsuranceCompany: SelectOption | null = null;
  policyNumber: string | null = null;
  isMain: boolean | null = false;
  file: File | null = null;
}
