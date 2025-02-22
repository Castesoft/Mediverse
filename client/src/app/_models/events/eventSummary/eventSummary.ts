import { Entity } from "src/app/_models/base/entity";
import { UserSummary } from "../../users/userSummary/userSummary";


export class EventSummary extends Entity {
  allDay = false;
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  patient: UserSummary = new UserSummary();
  doctor?: UserSummary;

  constructor(init?: Partial<EventSummary>) {
    super();

    Object.assign(this, init);
  }
}
