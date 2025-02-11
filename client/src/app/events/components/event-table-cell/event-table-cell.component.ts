import { Component, input, InputSignal } from '@angular/core';
import Event from "src/app/_models/events/event";
import { TimePeriodCellComponent } from "src/app/_shared/template/components/tables/cells/time-period-cell.component";

@Component({
  selector: 'div[eventTableCell]',
  imports: [
    TimePeriodCellComponent
  ],
  templateUrl: './event-table-cell.component.html',
  styleUrl: './event-table-cell.component.scss'
})
export class EventTableCellComponent {
  event: InputSignal<Partial<Event> | Event> = input.required();
  showTooltip: boolean = false;
}
