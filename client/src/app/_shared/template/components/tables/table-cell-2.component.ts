import { CommonModule } from "@angular/common";
import { Component, model, input, HostBinding, effect } from "@angular/core";
import { RouterModule } from "@angular/router";
import { createId } from "@paralleldrive/cuid2";
import { TableCellItem } from "src/app/_models/tables/tableCellItem";


@Component({
  selector: 'td[tableCell2]',
  templateUrl: './table-cell-2.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule,],
})
export class TableCell2Component {
  item = model.required<TableCellItem<any, any>>();
  isCompact = model.required<boolean>();
  value = input.required<any>();
  guid = createId();

  linkClass = 'd-flex align-items-center';
  class = '';

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

      // if (this.item().isLink) {
      //   this.class = `name align-middle white-space-nowrap px-0 py-0`;
      // }

    });
  }
}
