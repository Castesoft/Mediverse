import { doctorFormInfo } from "src/app/_models/doctors/doctorConstants";
import { Doctor } from "src/app/_models/doctors/doctor.model";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";

export class DoctorForm extends FormGroup2<Doctor> {
  constructor() {
    super(Doctor, new Doctor(), doctorFormInfo);
  }
}
