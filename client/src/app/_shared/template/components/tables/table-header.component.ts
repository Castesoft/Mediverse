import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation, OnInit, inject, model, input, output, effect } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSortUp, faSortDown, faSort } from "@fortawesome/free-solid-svg-icons";
import { createId } from "@paralleldrive/cuid2";
import { Column } from "src/app/_models/base/column";
import { Entity } from "src/app/_models/base/entity";
import { EntityParams } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { SelectOption } from "src/app/_models/base/selectOption";
import { CatalogMode } from "src/app/_models/base/types";
import { SortOptions } from "src/app/_models/types";
import { DevService } from "src/app/_services/dev.service";
import { IconsService } from "src/app/_services/icons.service";
import {
  TableHeaderCheckCellComponent
} from "src/app/_shared/template/components/tables/table-header-check-cell.component";
import {
  TABLE_HEADER_CHECK_CELL_TH_CLASS,
  TABLE_HEADER_CHECK_CELL_TH_STYLE,
  TABLE_HEADER_TR_CLASS
} from "src/app/_shared/template/components/tables/tableConstants";

@Component({
  selector: "thead[tableHeader]",
  templateUrl: "./table-header.component.html",
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [ CommonModule, FontAwesomeModule, FormsModule, TableHeaderCheckCellComponent ]
})
export class TableHeaderComponent implements OnInit {
  private dev = inject(DevService);
  icons = inject(IconsService);

  // Inputs
  columns = model.required<Column[]>();
  isCompact = model.required<boolean>();
  mode = model<CatalogMode>("view");
  show = input<boolean>(true);
  disableFirstCellPadding = input<boolean>(false);

  params = model<EntityParams<any> | null>(null);
  dictionary = model<NamingSubject | null>(null);

  selected = model(false);

  // Optional inputs
  sortable = input<boolean>(true);
  showActions = input<boolean>(true);

  // Outputs
  onParamsChange = output<SortOptions>();
  onSelectAll = output<boolean>();

  isDev = false;
  guid = createId();
  trClass = TABLE_HEADER_TR_CLASS;
  tableHeaderCheckCellThStyle = TABLE_HEADER_CHECK_CELL_TH_STYLE;
  tableHeaderCheckCellThClass = TABLE_HEADER_CHECK_CELL_TH_CLASS;

  constructor() {
    effect(() => {
      if (!this.params()) {
        this.params.set(new EntityParams<any>('defaultKey', {}));
      }

      if (!this.dictionary()) {
        this.dictionary.set(new NamingSubject('masculine', 'entidad', 'entidades', 'Entidades', 'entities'));
      }
    });
  }

  ngOnInit(): void {
  }

  selectAllItems(event: boolean) {
    this.selected.set(event);
    this.onSelectAll.emit(event);
  }

  getIcon(columnName: string) {
    if (this.params() && this.params()!.sort?.name === columnName && this.params()!.isSortAscending) {
      return faSortUp;
    } else if (this.params() && this.params()!.sort?.name === columnName && !this.params()!.isSortAscending) {
      return faSortDown;
    } else {
      return faSort;
    }
  }

  onClick(name: string) {
    if (!this.params()) return;
    this.params.update((oldValues: EntityParams<Entity> | null) => {
      if (!oldValues) return null;
      const newValues: EntityParams<Entity> = new EntityParams<Entity>(oldValues.key, { ...oldValues });
      newValues.sort = new SelectOption({ name: name, code: name });
      newValues.isSortAscending = !oldValues.isSortAscending;
      return newValues;
    });
  }
}
