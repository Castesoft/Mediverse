import { CommonModule } from "@angular/common";
import {
  Component,
  effect,
  inject,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  ViewEncapsulation
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
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
import { TABLE_HEADER_TR_CLASS } from "src/app/_shared/template/components/tables/tableConstants";

@Component({
  selector: "thead[tableHeader]",
  templateUrl: "./table-header.component.html",
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    TableHeaderCheckCellComponent
  ]
})
export class TableHeaderComponent {
  readonly dev: DevService = inject(DevService);
  readonly icons: IconsService = inject(IconsService);

  // Inputs
  columns: ModelSignal<Column[]> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model("view" as CatalogMode);

  show: InputSignal<boolean> = input(true);
  disableFirstCellPadding: InputSignal<boolean> = input(false);

  params: ModelSignal<EntityParams<any> | null> = model(null as EntityParams<any> | null);
  dictionary: ModelSignal<NamingSubject | null> = model(null as NamingSubject | null);

  selected: ModelSignal<boolean> = model(false);

  // Optional inputs
  sortable: InputSignal<boolean> = input(true);
  showActions: InputSignal<boolean> = input(true);

  // Outputs
  onParamsChange: OutputEmitterRef<SortOptions> = output();
  onSelectAll: OutputEmitterRef<boolean> = output();

  trClass: string = TABLE_HEADER_TR_CLASS;

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
