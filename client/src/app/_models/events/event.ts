import { Address } from "src/app/_models/addresses/address";
import { Entity } from "src/app/_models/base/entity";
import { SelectOption } from "src/app/_models/base/selectOption";
import { Payment } from "../payments/payment";
import { Prescription } from "../prescriptions/prescription";
import { Service } from "src/app/_models/services/service";
import { User } from "src/app/_models/users/user";


export class Event extends Entity {
  allDay = false;
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  paymentStatus: SelectOption | null = null;
  paymentMethodType: SelectOption | null = null;
  medicalInsuranceCompany: SelectOption | null = null;
  evolution: string | null = null;
  nextSteps: string | null = null;

  patient: User = new User();
  doctor: User = new User();
  service: Service = new Service();
  clinic: Address = new Address();
  nurses: User[] = [];
  payments: Payment[] = [];
  prescriptions: Prescription[] = [];

  select: SelectOption | null = null;

  constructor(init?: Partial<Event>) {
    super();
    Object.assign(this, init);
  }
}
