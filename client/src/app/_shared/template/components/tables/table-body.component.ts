import { CommonModule } from "@angular/common";
import { Component, input, InputSignal } from "@angular/core";

@Component({
  host: { class: 'fw-semibold text-gray-600', },
  selector: 'tbody[templateTableBody]',
  templateUrl: './table-body.component.html',
  imports: [ CommonModule ],
  standalone: true,
})
export class TableBodyComponent {
  count: InputSignal<number | undefined> = input();
}
