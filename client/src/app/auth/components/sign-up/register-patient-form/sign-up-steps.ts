import { AuthFormStep } from "src/app/auth/models/authFormStep";

export const authFormSteps: AuthFormStep[] = [
  { number: 1, title: 'Tipo de cuenta', subtitle: 'Selecciona tu tipo de cuenta' }
];

export const authFormStepsPatient: AuthFormStep[] = [
  { number: 1, title: 'Tipo de cuenta', subtitle: 'Selecciona tu tipo de cuenta' },
  { number: 2, title: 'Ajustes de Cuenta', subtitle: 'Configure su cuenta' },
  { number: 3, title: 'Completada', subtitle: 'Su cuenta ha sido creada' },
];

export const authFormStepsDoctor: AuthFormStep[] = [
  { number: 1, title: 'Tipo de cuenta', subtitle: 'Selecciona tu tipo de cuenta' },
  { number: 2, title: 'Ajustes de Cuenta', subtitle: 'Configure su cuenta' },
  { number: 3, title: 'Detalles de Cuenta', subtitle: 'Ingrese los detalles de cuenta' },
  { number: 4, title: 'Facturación', subtitle: 'Datos de facturación' },
  { number: 5, title: 'Completada', subtitle: 'Su cuenta ha sido creada' },
]
