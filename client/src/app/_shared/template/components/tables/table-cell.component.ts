import { CommonModule } from "@angular/common";
import { Component, model, input, HostBinding, effect } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TableCellItem } from "src/app/_models/tables/tableCellItem";


@Component({
  selector: 'td[tableCell]',
  templateUrl: './table-cell.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule,],
})
export class TableCellComponent {
  item = model.required<TableCellItem<any, any>>();
  value = input.required<any>();

  linkClass = 'd-flex align-items-center px-0';
  class = '';

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      switch (this.item().type) {
        case 'number':
          this.class = `${this.class} text-end`;
          this.linkClass = `${this.linkClass} justify-content-end`;
          break;
        case 'date':
          this.class = `${this.class} text-end`;
          this.linkClass = `${this.linkClass} justify-content-end`;
          break;
        case 'string':
          this.class = `${this.class} text-start`;
          this.linkClass = `${this.linkClass} justify-content-start`;
          break;
      }

      if (this.item().isLink) {
        this.class = ``;
      }
    });
  }
}
