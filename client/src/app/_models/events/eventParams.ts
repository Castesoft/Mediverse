import { EntityParams } from "src/app/_models/base/entityParams";
import { SelectOption } from 'src/app/_models/base/selectOption';
import Event from "src/app/_models/events/event";
import { EventRoles } from "src/app/_models/events/eventTypes";


export class EventParams extends EntityParams<Event> {
  role: EventRoles | null = null;

  // PatientId retrieves all events where the patient is the patientId
  patientId: number | null = null;

  // NurseId retrieves all events where the nurse is the nurseId
  nurseId: number | null = null;

  // DoctorId retrieves all events where the doctor is the doctorId
  doctorId: number | null = null;

  // UserId retrieves all events where the userId is either the patient, nurse, or doctor
  userId: number | null = null;

  serviceId: number | null = null;
  clinicId: number | null = null;

  month: number | null = null;
  year: number | null = null;

  isCalendarView: boolean = false;

  patients: SelectOption[] = [];
  services: SelectOption[] = [];
  nurses: SelectOption[] = [];
  clinics: SelectOption[] = [];

  constructor(key: string | null, init?: Partial<EventParams>) {
    super(key, init);
    Object.assign(this, init);
  }
}
