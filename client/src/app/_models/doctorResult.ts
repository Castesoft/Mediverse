import { SelectOption } from "src/app/_forms/form";
import { FormInfo } from "src/app/_forms/form2";
import { Address, addressInfo } from "src/app/_models/address";
import { AvailableDay, availableDayInfo } from "src/app/_models/availableDay";
import { DoctorReview, doctorReviewInfo } from "src/app/_models/doctorReview";

export class DoctorResult {
  id: number | null = null;
  fullName: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  title: any;
  requireAnticipatedCardPayments: boolean = false;

  addresses: Address[] = [];
  specialties: SelectOption[] = [];
  paymentMethods: SelectOption[] = [];
  services: SelectOption[] = [];
  medicalInsuranceCompanies: SelectOption[] = [];

  availableDays: AvailableDay[] = [];
  reviews: DoctorReview[] = [];
  photoUrl: string | null = null;
  email: string | null = null;
  phoneNumber: string | null = null;
  hasPatientInformationAccess: boolean = false;

  constructor(init?: Partial<Omit<DoctorResult, 'getAvailableDayByIndex'>>) {
    Object.assign(this, init);
  }

  getAvailableDayByDayNumber(dayNumber: number): AvailableDay | null {
    const day = this.availableDays.find(d => d.dayNumber === dayNumber);

    if (this.availableDays && this.availableDays.length) {
      if (day) {
        return day;
      }
    }

    return null;
  }
}

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
