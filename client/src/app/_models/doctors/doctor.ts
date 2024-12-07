import { SelectOption } from "src/app/_models/base/selectOption";


export class Doctor {
  id: number | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  fullName: string | null = null;
  createdAt: Date | null = null;
  lastActive: Date | null = null;;
  dateOfBirth: Date | null = null;;
  email: string | null = null;
  username: string | null = null;
  sex: SelectOption | null = null;
  phoneNumber: string | null = null;
  photoUrl: string | null = null;
  age: number | null = null;
  specialty: string | null = null;
  accessGranted: Date | null = null;

  constructor(init?: Partial<Doctor>) {
    Object.assign(this, init);
  }
}
