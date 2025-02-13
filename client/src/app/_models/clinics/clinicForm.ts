import Clinic from "src/app/_models/clinics/clinic";
import { clinicFormInfo } from "src/app/_models/clinics/clinicConstants";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";

export default class ClinicForm extends FormGroup2<Clinic> {
  constructor() {
    super(Clinic, new Clinic(), clinicFormInfo);
  }

  get payload(): any {
    return {
      name: this.controls.name.value,
      description: this.controls.description.value,
      street: this.controls.street.value,
      interiorNumber: this.controls.interiorNumber.value,
      exteriorNumber: this.controls.exteriorNumber.value,
      neighborhood: this.controls.neighborhood.value,
      city: this.controls.city.value,
      state: this.controls.state.value,
      zipcode: this.controls.zipcode.value,
      country: this.controls.country.value,
      isMain: this.controls.isMain.value,
    }
  }

}
