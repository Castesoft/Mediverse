import { addressInfo } from "src/app/_models/addresses/addressConstants";
import { availableDayInfo } from "src/app/_models/availableDay";
import { DoctorResult } from "src/app/_models/doctorResults/doctorResult";
import { doctorReviewInfo } from "src/app/_models/doctorReview";
import { FormInfo } from "src/app/_models/forms/formTypes";


export const doctorResultInfo: FormInfo<DoctorResult> = {
  addresses: addressInfo,
  email: { label: 'Email', type: 'text' },
  firstName: { label: 'Nombre', type: 'text' },
  fullName: { label: 'Nombre completo', type: 'text' },
  availableDays: availableDayInfo,
  hasPatientInformationAccess: { label: 'Acceso a información de pacientes', type: 'checkbox' },
  id: { label: 'ID', type: 'number' },
  lastName: { label: 'Apellido', type: 'text' },
  medicalInsuranceCompanies: { label: 'Compañías de seguros médicos', type: 'select' },
  paymentMethods: { label: 'Métodos de pago', type: 'select' },
  phoneNumber: { label: 'Número de teléfono', type: 'text' },
  photoUrl: { label: 'URL de foto', type: 'text' },
  requireAnticipatedCardPayments: { label: 'Requiere pagos con tarjeta anticipados', type: 'checkbox' },
  reviews: doctorReviewInfo,
  services: { label: 'Servicios', type: 'select' },
  specialties: { label: 'Especialidades', type: 'select' },
  title: { label: 'Título', type: 'text' },
} as FormInfo<DoctorResult>;
