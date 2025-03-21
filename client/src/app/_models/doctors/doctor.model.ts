import { DoctorClinic } from 'src/app/_models/doctors/doctorClinics/doctorClinic';
import { MedicalLicense } from 'src/app/_models/medicalLicenses/medicalLicense';
import { User } from 'src/app/_models/users/user';


export class Doctor extends User {
  specialty: string | null = null;
  accessGranted: Date | null = null;
  medicalLicenses: MedicalLicense[] = [];
  mainSpecialty: string | null = null;
  clinics: DoctorClinic[] = [];

  constructor(init?: Partial<Doctor>) {
    super();
    Object.assign(this, init);
  }
}
