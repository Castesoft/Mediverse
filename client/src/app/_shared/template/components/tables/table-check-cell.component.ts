import {
  Component,
  model,
  input,
  HostBinding,
  effect,
  ModelSignal,
  InputSignal,
  OutputEmitterRef, output
} from "@angular/core";
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
  isChecked: InputSignal<boolean> = input.required();
  isCompact: InputSignal<boolean> = input.required();
  isDisabled: InputSignal<boolean | undefined> = input();

  checkboxChange: OutputEmitterRef<boolean> = output();

  divClass: string = TABLE_CHECK_CELL_ITEM_DIV_CLASS;

  class: string = 'fs-6 align-middle';
  cuid: string = createId();

  @HostBinding('class') get hostClasses() {
    return this.class;
  }

  constructor() {
    effect((): void => {
      this.class = `${this.class} py-1 pe-3 ps-1 border-none`;
    });
  }

  onCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.checkboxChange.emit(checkbox.checked);
  }
}
