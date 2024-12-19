import { EntityParams } from "src/app/_models/base/entityParams";
import Event from "src/app/_models/events/event";
import { EventRoles } from "src/app/_models/events/eventTypes";


export class EventParams extends EntityParams<Event> {
  patientId: number | null = null;
  role: EventRoles | null = null;

  constructor(key: string | null, init?: Partial<EventParams>) {
    super(key, init);
    Object.assign(this, init);
  }
}
