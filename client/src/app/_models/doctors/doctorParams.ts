import { EntityParams } from "src/app/_models/base/entityParams";
import { Doctor } from "src/app/_models/doctors/doctor.model";


export class DoctorParams extends EntityParams<Doctor> {
  constructor(key: string | null, init?: Partial<DoctorParams>) {
    super(key);
    Object.assign(this, init);
  }
}
