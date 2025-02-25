import { Address } from "src/app/_models/addresses/address";
import { AvailableDay } from "src/app/_models/availableDay";
import { SelectOption } from "src/app/_models/base/selectOption";
import { DoctorReview } from "../doctorReviews/doctorReview";
import { AvailableTime } from "src/app/_models/availableTime";


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
    Object.setPrototypeOf(this, DoctorResult.prototype);
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

  updateAvailableDayAndTime(day: number | null, time: number | null): this {
    console.log('Running updateAvailableDayAndTime: ');
    console.log('day', day);
    console.log('time', time);
    console.log('availableDays', this.availableDays);
    console.log('=====================================');

    if (day === null) throw new Error('Day is null');
    if (time === null) throw new Error('Time is null');
    if (this.availableDays.length === 0) throw new Error('Available days is empty');


    const dayIndex: number = this.availableDays.findIndex((d: AvailableDay) => d.dayNumber === day);
    if (dayIndex === -1) throw new Error('Day not found');

    const foundTime: AvailableTime | undefined = this.availableDays[dayIndex].availableTimes.at(time);
    if (!foundTime) throw new Error('Time not found');

    this.availableDays[dayIndex].availableTimes[time].available = false;

    return this;
  }
}
