import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Insurance } from "src/app/_models/insurances/insurance";
import { insuranceFormInfo } from "src/app/_models/insurances/insuranceConstants";


export class InsuranceForm extends FormGroup2<Insurance> {
  constructor() {
    super(Insurance, new Insurance(), insuranceFormInfo);
  }

  get payload(): FormData {
    const data = new FormData();
    const medicalInsuranceCompany = this.controls.medicalInsuranceCompany.value;
    if (medicalInsuranceCompany !== null) {
      if (medicalInsuranceCompany.id !== null) {
        data.append('medicalInsuranceCompany.Id', medicalInsuranceCompany.id.toString());
      }
      if (medicalInsuranceCompany.name !== null) {
        data.append('medicalInsuranceCompany.Name', medicalInsuranceCompany.name);
      }
    }
    if (this.controls.policyNumber.value !== null) {
      data.append('policyNumber', this.controls.policyNumber.value);
    }
    if (this.controls.isMain.value !== null) {
      data.append('isMain', this.controls.isMain.value.toString());
    }
    if (this.controls.file.value !== null) {
      data.append('file', this.controls.file.value);
    }

    console.log('data', data);
    console.log(this);



    return data;
  }
}
