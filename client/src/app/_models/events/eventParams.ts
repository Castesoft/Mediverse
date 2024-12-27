import { EntityParams } from "src/app/_models/base/entityParams";
import { SelectOption } from 'src/app/_models/base/selectOption';
import Event from "src/app/_models/events/event";
import { EventRoles } from "src/app/_models/events/eventTypes";


export class EventParams extends EntityParams<Event> {
  role: EventRoles | null = null;
  
  patientId: number | null = null;
  serviceId: number | null = null;
  nurseId: number | null = null;
  clinicId: number | null = null;

  patients: SelectOption[] = [];
  services: SelectOption[] = [];
  nurses: SelectOption[] = [];
  clinics: SelectOption[] = [];

  constructor(key: string | null, init?: Partial<EventParams>) {
    super(key, init);
    Object.assign(this, init);
  }
}
