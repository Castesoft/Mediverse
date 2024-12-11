import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation, OnInit, inject, model, input, output, effect } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSortUp, faSortDown, faSort } from "@fortawesome/free-solid-svg-icons";
import { createId } from "@paralleldrive/cuid2";
import { Column } from "src/app/_models/base/column";
import { EntityParams } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { CatalogMode } from "src/app/_models/base/types";
import { SortOptions } from "src/app/_models/types";
import { DevService } from "src/app/_services/dev.service";
import { IconsService } from "src/app/_services/icons.service";
import { TableHeaderCheckCellComponent } from "src/app/_shared/template/components/tables/table-header-check-cell.component";
import { TABLE_HEADER_CHECK_CELL_TH_CLASS, TABLE_HEADER_CHECK_CELL_TH_STYLE, TABLE_HEADER_TR_CLASS } from "src/app/_shared/template/components/tables/tableConstants";


@Component({
  selector: "thead[tableHeader]",
  templateUrl: "./table-header.component.html",
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, TableHeaderCheckCellComponent,],
})
export class TableHeaderComponent implements OnInit {
  private dev = inject(DevService);
  icons = inject(IconsService);

  // inputs
  // required
  columns = model.required<Column[]>();
  params = model.required<EntityParams<any> | any | null>();
  isCompact = model.required<boolean>();
  mode = model.required<CatalogMode>();
  dictionary = model.required<NamingSubject>();
  show = input<boolean>(true);
  disableFirstCellPadding = input<boolean>(false);

  selected = model(false);

  // optional
  sortable = input<boolean>(true);
  showActions = input<boolean>(true);

  // outputs
  onParamsChange = output<SortOptions>();
  onSelectAll = output<boolean>();

  isDev = false;
  guid = createId();
  trClass = TABLE_HEADER_TR_CLASS;
  tableHeaderCheckCellThStyle = TABLE_HEADER_CHECK_CELL_TH_STYLE;
  tableHeaderCheckCellThClass = TABLE_HEADER_CHECK_CELL_TH_CLASS;

  constructor() {
    effect(() => { });
  }

  ngOnInit(): void {
  }

  selectAllItems(event: Event) {
    const input = event.target as EventTarget as HTMLInputElement;
    this.onSelectAll.emit(input.checked);
  }

  getIcon(columnName: string) {
    if (this.params().sort === columnName && this.params().isSortAscending) {
      return faSortUp;
    } else if (this.params().sort === columnName &&
      !this.params().isSortAscending) {
      return faSortDown;
    } else {
      return faSort;
    }
  }

  onClick = (name: string) => this.onParamsChange.emit(new SortOptions(name, !this.params().isSortAscending));
}
