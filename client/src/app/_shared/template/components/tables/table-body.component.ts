import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  host: { class: 'fw-semibold text-gray-600', },
  selector: 'tbody[templateTableBody]',
  template: `<ng-content></ng-content>`,
  imports: [ CommonModule ],
  standalone: true,
})
export class TableBodyComponent {}
