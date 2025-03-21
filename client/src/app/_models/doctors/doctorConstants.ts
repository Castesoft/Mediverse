import { Doctor } from "src/app/_models/doctors/doctor.model";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { DoctorParams } from "src/app/_models/doctors/doctorParams";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";


export const doctorFormInfo: FormInfo<Doctor> = {
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
} as unknown as FormInfo<Doctor>;

export const doctorFiltersFormInfo: FormInfo<DoctorParams> = {
  ...baseFilterFormInfo,
} as FormInfo<DoctorParams>;
