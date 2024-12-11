import { CommonModule } from "@angular/common";
import { Component, input, model, signal } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { createId } from "@paralleldrive/cuid2";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { CatalogMode } from "src/app/_models/base/types";

// th class="w-10px pe-2 sorting_disabled" rowspan="1" colspan="1" style="width: 29.9px;"

@Component({
  host: { class: 'w-10px pe-2 sorting_disabled', 'rowspan': '1', 'colspan': '1', 'style': 'width: 29.9px;', },
  selector: 'th[tableHeaderCheckCell]',
  templateUrl: './table-header-check-cell.component.html',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, ],
})
export class TableHeaderCheckCellComponent {
  isCompact = model.required<boolean>();
  dictionary = model.required<NamingSubject>();
  selected = model.required<boolean>();
  mode = model.required<CatalogMode>();

  cuid = signal<string>(createId());
}
