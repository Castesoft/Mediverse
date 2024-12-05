import { Account } from "src/app/_models/account";
import { Entity } from "src/app/_models/base/entity";
import { SelectOption } from "src/app/_models/base/selectOption";
import { Clinic } from "src/app/_models/clinics/clinic";
import { Event } from "src/app/_models/events/event";
import { PrescriptionItem } from "src/app/_models/prescriptionItem";
import { Patient } from "../patients/patient";


export class Prescription extends Entity {
  exchangeAmount: number | null = null;
  notes: string | null = null;
  logoUrl: string | null = null;
  orderId: number | null = null;
  date: Date | null = null;

  doctor: Account = new Account();

  clinic: Clinic = new Clinic();
  event: Event = new Event();

  patient: Patient = new Patient();
  items: PrescriptionItem[] = [];
  product: SelectOption | null = null;

  isCollapsed = true;

  constructor(init?: Partial<Prescription>) {
    super();

    Object.assign(this, init);
  }
}
