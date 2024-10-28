import { Entity } from "src/app/_models/types";
import { UserSummary } from "src/app/_models/userSummary";

export class EventSummary extends Entity {
  allDay = false;
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  patient: UserSummary = new UserSummary();

  constructor(init?: Partial<EventSummary>) {
    super();

    Object.assign(this, init);
  }
}
