import { SelectOption } from "src/app/_forms/form";
import { FormInfo } from "src/app/_forms/form2";

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

export const doctorInfo: FormInfo<Doctor> = {
  accessGranted: { label: 'Acceso concedido', type: 'date' },
  age: { label: 'Edad', type: 'number' },
  createdAt: { label: 'Creado en', type: 'date' },
  dateOfBirth: { label: 'Fecha de nacimiento', type: 'date' },
  email: { label: 'Email', type: 'text' },
  firstName: { label: 'Nombre', type: 'text' },
  fullName: { label: 'Nombre completo', type: 'text' },
  id: { label: 'ID', type: 'number' },
  lastActive: { label: 'Último activo', type: 'date' },
  lastName: { label: 'Apellido', type: 'text' },
  phoneNumber: { label: 'Número de teléfono', type: 'text' },
  photoUrl: { label: 'URL de foto', type: 'text' },
  sex: { label: 'Sexo', type: 'select' },
  specialty: { label: 'Especialidad', type: 'text' },
  username: { label: 'Nombre de usuario', type: 'text' },
} as FormInfo<Doctor>;
