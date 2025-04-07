import { createId } from "@paralleldrive/cuid2";
import { eventFiltersFormInfo } from "src/app/_models/events/eventConstants";
import { EventParams } from "src/app/_models/events/eventParams";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";

export class EventFiltersForm extends FormGroup2<EventParams> {
  constructor() {
    super(EventParams as any, new EventParams(createId()), eventFiltersFormInfo);
  }
}
