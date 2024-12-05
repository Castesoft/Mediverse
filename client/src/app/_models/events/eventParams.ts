import { EntityParams } from "src/app/_models/base/entityParams";
import { Event } from "src/app/_models/events/event";


export class EventParams extends EntityParams<Event> {
  constructor(key: string | null) {
    super(key);
  }
}
