import { Event } from "src/app/_models/events/event";
import { eventFormInfo } from "src/app/_models/events/eventConstants";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";


export class EventForm extends FormGroup2<Event> {
  constructor() {
    super(Event, new Event(), eventFormInfo);
  }
}
