import { SelectOption } from 'src/app/_models/base/selectOption';
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { MedicalLicense } from 'src/app/_models/medicalLicenses/medicalLicense';
import { medicalLicenseFormInfo } from 'src/app/_models/medicalLicenses/medicalLicenseConstants';


export class MedicalLicenseForm extends FormGroup2<MedicalLicense> {

  private _specialtyOptions: SelectOption[] = [];

  setSpecialtyOptions(options: SelectOption[]): this {
    this._specialtyOptions = options;
    this.controls.specialty.selectOptions = options;
    return this;
  }

  constructor() {
    super(MedicalLicense, new MedicalLicense(), medicalLicenseFormInfo);
  }

  get payload(): FormData {
    const data = new FormData();

    const specialty = this.controls.specialty.value;
    if (specialty !== null) {
      if (specialty.id !== null) {
        data.append('specialty.Id', specialty.id.toString());
      }
      if (specialty.name !== null) {
        data.append('specialty.Name', specialty.name);
      }
    }

    if (this.controls.licenseNumber.value !== null) {
      data.append('licenseNumber', this.controls.licenseNumber.value);
    }

    if (this.controls.specialtyLicense.value !== null) {
      data.append('specialtyLicense', this.controls.specialtyLicense.value);
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
