export interface Appointment {
  id: number;
  date: Date;
  time: Date;
  patient: Patient;
  doctor: Doctor;
  kind: AppointmentKind;
  status: AppointmentStatus;
  paymentBilling: PaymentBilling;
}

export interface PaymentBilling {
  services: Service[];
  paymentMethod: PaymentMethod;
  billingAddress: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  transactionId: string;
  paymentStatus: PaymentStatus;
  notes?: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
}

export enum PaymentMethod {
  Cash = 'Efectivo',
  CreditCard = 'Tarjeta de crédito',
  DebitCard = 'Tarjeta de débito',
  Insurance = 'Seguro médico',
  BankTransfer = 'Transferencia bancaria',
  Other = 'Otro',
}

export enum PaymentStatus {
  Paid = 'Pagada',
  Pending = 'Pendiente',
  Failed = 'Fallado',
}

export interface Patient {
  id: number;
  name: string;
  birthDate: Date;
  photoUrl: string;
  sex: Sex;
  address: string;
  phoneNumber: string;
  email: string;
  medicalHistory: MedicalHistory[];
  allergies: Allergy[];
  currentMedications: Medicine[];
  emergencyContact: EmergencyContact;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  phoneNumber: string;
  sex: Sex;
  email: string;
  officeAddress: string;
  licenseNumber: string;
  yearsOfExperience: number;
  education: Education[];
  certifications: string[];
  languagesSpoken: string[];
  availability: Availability[];
  bio: string;
}

export interface Medicine {
  id: number;
  name: string;
  description: string;
  price: number;
  dose: number;
  units: string;
}

export interface Allergy {
  id: number;
  name: string;
  description: string;
  severity: Severity;
  reactions: string[];
}

export enum Severity {
  Mild = 'Leve',
  Moderate = 'Moderado',
  Severe = 'Severo',
}

export interface MedicalHistory {
  id: number;
  condition: string;
  diagnosisDate: Date;
  status: string;
  notes?: string;
}

export interface Education {
  degree: string;
  institution: string;
  yearOfGraduation: number;
}

export interface Availability {
  day: string;
  startTime: string;
  endTime: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

export enum Sex {
  Male = 'Masculino',
  Female = 'Femenino',
}

export enum AppointmentKind {
  Consultation = 'Consulta',
  FollowUp = 'Seguimiento',
  Emergency = 'Emergencia',
}

export enum AppointmentStatus {
  Scheduled = 'Agendada',
  Completed = 'Completada',
  Canceled = 'Cancelada',
  NoShow = 'No se presentó',
}
