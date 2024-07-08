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