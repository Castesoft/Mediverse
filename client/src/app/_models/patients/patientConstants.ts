import { Column, columnId } from "src/app/_models/base/column"
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { Patient } from "src/app/_models/patients/patient";
import { PatientParams } from "src/app/_models/patients/patientParams";

export const patientFormInfo: FormInfo<Patient> = {
  ...baseInfo,
} as FormInfo<Patient>;

export const patientFiltersFormInfo: FormInfo<PatientParams> = {
  ...baseFilterFormInfo,
} as FormInfo<PatientParams>;

export const patientColumns: Column[] = [
  columnId,
  new Column('username', 'Usuario'),
  new Column('fullName', 'Nombre'),
  new Column('email', 'Correo electrónico'),
  new Column('phoneNumber', 'Teléfono'),
  new Column('age', 'Edad'),
  new Column('sex', 'Sexo'),
  new Column('dateOfBirth', 'Fecha de nacimiento'),
  new Column('taxId', 'RFC'),
];

export const patientDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'paciente',
  'pacientes',
  'Pacientes',
  'patients',
  ['home', 'patients']
);
