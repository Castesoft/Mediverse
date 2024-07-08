import { Doctor, Sex } from "../_models/user";

export const doctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Alejandro Martínez',
    specialty: 'Cardiología',
    sex: Sex.Male,
    phoneNumber: '555-1234',
    email: 'alejandromartinez@ejemplo.com',
    officeAddress: 'Avenida Reforma 456, Ciudad de México, México',
    licenseNumber: 'MED123456',
    yearsOfExperience: 15,
    education: [
      {
        degree: 'Licenciatura en Medicina',
        institution: 'Universidad Nacional Autónoma de México (UNAM)',
        yearOfGraduation: 2005,
      },
      {
        degree: 'Especialidad en Cardiología',
        institution: 'Instituto Nacional de Cardiología',
        yearOfGraduation: 2010,
      },
    ],
    certifications: ['Certificación Consejo Mexicano de Cardiología'],
    languagesSpoken: ['Español', 'Inglés'],
    availability: [
      {
        day: 'Lunes',
        startTime: '09:00',
        endTime: '17:00',
      },
      {
        day: 'Miércoles',
        startTime: '09:00',
        endTime: '17:00',
      },
      {
        day: 'Viernes',
        startTime: '09:00',
        endTime: '17:00',
      },
    ],
    bio: 'El Dr. Alejandro Martínez es un reconocido cardiólogo con más de 15 años de experiencia. Se especializa en el tratamiento de enfermedades cardiovasculares y ha trabajado en algunos de los hospitales más prestigiosos de México.',
  },
];
