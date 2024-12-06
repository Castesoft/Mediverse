import { Account } from "src/app/_models/account/account";
import { doctorInfo } from "src/app/_models/doctor";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { medicalLicenseInfo } from "src/app/_models/medicalLicense";
import { paymentMethodTypeFormInfo } from "src/app/_models/paymentMethodTypes/paymentMethodTypeConstants";
import { userMedicalInsuranceCompanyInfo } from "src/app/_models/userMedicalInsuranceCompany";
import { workScheduleInfo } from "src/app/_models/workSchedule";
import { workScheduleSettingsInfo } from "src/app/_models/workScheduleSettings";


export const accountFormInfo: FormInfo<Account> = {
  medicalInsuranceCompanies: userMedicalInsuranceCompanyInfo,
  certificateFile: { label: 'Cédula/Certificación', type: 'file' },
  licenseNumber: { label: 'Cédula Profesional', type: 'text' },
  photoFile: { label: 'Archivo de foto', type: 'file' },
  specialtyLicense: { label: 'Cédula de Especialidad', type: 'text' },
  acceptedPaymentMethods: { label: 'Métodos de pago aceptados', type: 'select' },
  removeAvatar: { label: 'Eliminar avatar', type: 'checkbox' },
  address: { label: 'Dirección', type: 'text' },
  bannerUrl: { label: 'Banner URL', type: 'text' },
  city: { label: 'Ciudad', type: 'text' },
  country: { label: 'País', type: 'text' },
  createdAt: { label: 'Creado en', type: 'date' },
  dateOfBirth: { label: 'Fecha de nacimiento', type: 'date' },
  doctorClinics: {},
  email: { label: 'Email', type: 'text' },
  firstName: { label: 'Nombre', type: 'text' },
  fullName: { label: 'Nombre completo', type: 'text' },
  id: { label: 'ID', type: 'number' },
  isEmailVerified: { label: 'Email verificado', type: 'checkbox' },
  isPhoneNumberVerified: { label: 'Teléfono verificado', type: 'checkbox' },
  lastName: { label: 'Apellido', type: 'text' },
  linkedEmail: { label: 'Email vinculado', type: 'checkbox' },
  linkedGoogle: { label: 'Google vinculado', type: 'checkbox' },
  mainSpecialty: { label: 'Especialidad principal', type: 'text' },
  medicalLicenses: medicalLicenseInfo,
  paymentMethodTypes: paymentMethodTypeFormInfo,
  permissions: {},
  phoneNumber: { label: 'Teléfono', type: 'text' },
  phoneNumberCountryCode: { label: 'Código de país de teléfono', type: 'text' },
  photoUrl: { label: 'URL de foto', type: 'text' },
  requireAnticipatedCardPayments: { label: 'Requiere pagos anticipados con tarjeta', type: 'checkbox' },
  requiresTwoFactor: { label: 'Requiere autenticación de dos factores', type: 'checkbox' },
  roles: {},
  sex: { label: 'Sexo', type: 'select' },
  sharedDoctors: doctorInfo,
  specialty: { label: 'Especialidad', type: 'select' },
  state: { label: 'Estado', type: 'text' },
  token: { label: 'Token', type: 'text' },
  twoFactorEnabled: { label: 'Dos factores habilitados', type: 'checkbox' },
  username: { label: 'Nombre de usuario', type: 'text' },
  workSchedules: workScheduleInfo,
  workScheduleSettings: workScheduleSettingsInfo,
} as FormInfo<Account>;
