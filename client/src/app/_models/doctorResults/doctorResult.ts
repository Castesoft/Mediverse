import { Address } from "src/app/_models/addresses/address";
import { AvailableDay } from "src/app/_models/availableDay";
import { SelectOption } from "src/app/_models/base/selectOption";
import { DoctorReview } from "src/app/_models/doctorReview";


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
