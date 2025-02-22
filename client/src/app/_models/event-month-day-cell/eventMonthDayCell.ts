import { EventSummary } from "src/app/_models/events/eventSummary/eventSummary";

export class EventMonthDayCell {
  date?: Date;
  events?: EventSummary[];
  totalCount?: number;
  hasMore: boolean = false;
}
