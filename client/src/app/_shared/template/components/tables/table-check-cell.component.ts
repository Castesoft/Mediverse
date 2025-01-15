import { Component, model, input, HostBinding, effect } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { createId } from "@paralleldrive/cuid2";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { TABLE_CHECK_CELL_ITEM_DIV_CLASS } from "src/app/_shared/template/components/tables/tableConstants";


@Component({
  selector: 'td[tableCheckCell]',
  templateUrl: './table-check-cell.component.html',
  standalone: true,
  imports: [ FormsModule ],
})
export class TableCheckCellComponent {
  isCompact = model.required<boolean>();
  idx = input.required<number>();
  dictionary = model.required<NamingSubject>();

  divClass = TABLE_CHECK_CELL_ITEM_DIV_CLASS;

  selected = model.required<boolean>();

  class = 'fs-6 align-middle';
  cuid = createId();

  @HostBinding('class') get hostClasses() {
    return this.class;
  }

  constructor() {
    effect((): void => {
      this.class = `${this.class} py-1 pe-3 ps-1 border-none`;
    });
  }
}
