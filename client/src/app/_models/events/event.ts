import { Address } from "src/app/_models/addresses/address";
import { Entity } from "src/app/_models/base/entity";
import { SelectOption } from "src/app/_models/base/selectOption";
import { Payment } from "../payments/payment";
import { Prescription } from "../prescriptions/prescription";
import { Service } from "src/app/_models/services/service";
import { Doctor } from 'src/app/_models/doctors/doctor';
import Patient from 'src/app/_models/patients/patient';
import Nurse from 'src/app/_models/nurses/nurse';


export default class Event extends Entity {
  allDay = false;
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  paymentStatus: SelectOption | null = null;
  paymentMethodType: SelectOption | null = null;
  medicalInsuranceCompany: SelectOption | null = null;
  evolution: string | null = null;
  nextSteps: string | null = null;

  patient: Patient = new Patient();
  doctor: Doctor = new Doctor();
  service: Service = new Service();
  clinic?: Address | undefined = new Address();
  nurses: Nurse[] = [];
  nurseOptions: SelectOption[] = [];
  payments: Payment[] = [];
  prescriptions: Prescription[] = [];
  nursesCount: number | null = null;

  select: SelectOption | null = null;

  constructor(init?: Partial<Event>) {
    super();
    Object.assign(this, init);
  }
}
