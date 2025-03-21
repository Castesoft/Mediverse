import { Entity } from "src/app/_models/base/entity";
import { SelectOption } from "src/app/_models/base/selectOption";
import Clinic from "src/app/_models/clinics/clinic";
import Event from "src/app/_models/events/event";
import { PrescriptionItem } from "src/app/_models/prescriptionItem";
import { Patient } from "../patients/patient";
import { Doctor } from 'src/app/_models/doctors/doctor.model';


export class Prescription extends Entity {
  exchangeAmount: number | null = null;
  notes: string | null = null;
  logoUrl: string | null = null;
  orderId: number | null = null;
  date: Date | null = null;

  doctor: Doctor = new Doctor();

  clinic: Clinic = new Clinic();
  event: Event = new Event();

  patient: Patient = new Patient();
  items: PrescriptionItem[] = [];
  product: SelectOption | null = null;

  constructor(init?: Partial<Prescription>) {
    super();
    Object.assign(this, init);
  }
}
