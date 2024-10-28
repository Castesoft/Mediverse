import { Validators } from "@angular/forms";
import { SelectOption } from "src/app/_forms/form";
import { FormInfo, FormGroup2 } from "src/app/_forms/form2";

export class Insurance {
  medicalInsuranceCompany: SelectOption | null = null;
  policyNumber: string | null = null;
  isMain: boolean | null = false;
  file: File | null = null;
}

export const insuranceInfo: FormInfo<Insurance> = {
  file: { label: 'Archivo', type: 'file', validators: [ Validators.required ], },
  isMain: { label: 'Es principal', type: 'checkbox', validators: [ Validators.required ], title: '¿Establecer esta póliza como la principal?', helperText: 'Esta póliza aparecerá primero en la selección de pólizas al agendar una cita.' },
  medicalInsuranceCompany: { label: 'Aseguradora', type: 'typeahead', validators: [ Validators.required ] },
  policyNumber: { label: 'Número de póliza', type: 'text', validators: [ Validators.required ] },
} as FormInfo<Insurance>;

export class InsuranceForm extends FormGroup2<Insurance> {
  constructor() {
    super(Insurance, new Insurance(), insuranceInfo);
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

    console.log('data',data);
    console.log(this);



    return data;
  }
}
