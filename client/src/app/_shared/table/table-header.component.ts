import { Component, effect, inject, input, model, OnInit, output, ViewEncapsulation } from "@angular/core";
import { CatalogMode, Column, SortOptions } from "src/app/_models/types";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { EnvService } from "src/app/_services/env.service";
import { IconsService } from "src/app/_services/icons.service";
import { NgClass } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { createId } from "@paralleldrive/cuid2";
import { FormsModule } from "@angular/forms";
import { EntityParams } from "src/app/_forms/form";

@Component({
  selector: "thead[tableHeader]",
  templateUrl: "./table-header.component.html",
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgClass, FontAwesomeModule, FormsModule]
})
export class TableHeaderComponent implements OnInit {
  private devService = inject(EnvService);
  icons = inject(IconsService);

  // inputs
  // required
  columns = input.required<Column[]>();
  params = input.required<EntityParams<any> | any | undefined>();
  mode = input.required<CatalogMode>();
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

  constructor() {
    effect(() => {});
  }

  ngOnInit(): void {
    this.devService.mode$.subscribe({ next: mode => this.isDev = mode });
  }

  selectAllItems(event: Event) {
    const input = event.target as EventTarget as HTMLInputElement;
    this.onSelectAll.emit(input.checked);
  }

  getIcon(columnName: string) {
    if (this.params().sort === columnName && this.params().isSortAscending) {
      return faSortUp;
    } else if (
      this.params().sort === columnName &&
      !this.params().isSortAscending
    ) {
      return faSortDown;
    } else {
      return faSort;
    }
  }

  onClick = (name: string) => this.onParamsChange.emit(new SortOptions(name, !this.params().isSortAscending));
}
