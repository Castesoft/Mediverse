import { CommonModule } from "@angular/common";
import { Component, model, input, HostBinding, effect, ModelSignal, InputSignal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TableCellItem } from "src/app/_models/tables/tableCellItem";


@Component({
  selector: 'td[tableCell2]',
  templateUrl: './table-cell-2.component.html',
  styleUrls: [ './table-cell-2.component.scss' ],
  standalone: true,
  imports: [ RouterModule, CommonModule ],
})
export class TableCell2Component {
  item: ModelSignal<TableCellItem<any, any>> = model.required<TableCellItem<any, any>>();
  isCompact: ModelSignal<boolean> = model.required<boolean>();
  value: InputSignal<any> = input.required<any>();

  linkClass: string = 'd-flex align-items-center';
  class: string = '';

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      this.class = `${this.class}`;
      switch (this.item().type) {
        case 'number':
          this.class = `${this.class} text-end pe-0`;
          this.linkClass = `${this.linkClass} justify-content-end`;
          break;
        case 'date':
          this.class = `${this.class} text-end pe-0`;
          this.linkClass = `${this.linkClass} justify-content-end`;
          break;
        case 'string':
          this.class = `${this.class} text-start ps-0`;
          this.linkClass = `${this.linkClass} justify-content-start`;
          break;
      }
      switch (this.item().justification) {
        case 'center':
          this.class = `${this.class} text-center`;
          break;
        case 'end':
          this.class = `${this.class} text-end pe-0`;
          break;
        case 'start':
          this.class = `${this.class} text-start ps-0`;
          break;
      }
    });
  }
}
