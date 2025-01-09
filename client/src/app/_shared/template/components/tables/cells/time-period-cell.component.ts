import { Component, model } from "@angular/core";
import { DatePipe } from "@angular/common";

@Component({
  selector: "td[timePeriodCell]",
  templateUrl: "./time-period-cell.component.html",
  styleUrls: [ "./time-period-cell.component.scss" ],
  imports: [ DatePipe ],
  standalone: true
})
export class TimePeriodCellComponent {
  from = model.required<Date | null>();
  to = model.required<Date | null>();
  showDate = model.required<boolean>();
  allDay = model<boolean>(false);
}
