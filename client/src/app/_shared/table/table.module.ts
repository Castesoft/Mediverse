import { NgModule } from "@angular/core";
import { Entity } from "src/app/_models/base/entity";
import { EntityParams } from "src/app/_models/base/entityParams";
import { View, CatalogMode } from "src/app/_models/base/types";
import { FormUse } from "src/app/_models/forms/formTypes";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";
import { TableLoadingPlaceholderComponent } from "src/app/_shared/table/table-loading-placeholder.component";
import { TableCell2Component, TableMenuCellComponent, TableCellComponent, TableCheckCellComponent } from "src/app/_shared/table/table-menu.component";
import { TablePagerComponent } from "src/app/_shared/table/table-pager.component";
import { TableWrapperComponent } from "src/app/_shared/table/table-wrapper.component";

@NgModule({
  imports: [
    TableWrapperComponent,
    TableCell2Component,
    TableHeaderComponent,
    TableMenuCellComponent,
    TableCellComponent,
    TablePagerComponent,
    TableCheckCellComponent,
    TableLoadingPlaceholderComponent,
  ],
  exports: [
    TableWrapperComponent,
    TableCell2Component,
    TableHeaderComponent,
    TableMenuCellComponent,
    TableCellComponent,
    TablePagerComponent,
    TableCheckCellComponent,
    TableLoadingPlaceholderComponent,
  ],
})
export class TableModule {}

export class FilterModal {
  formId!: string;
  key!: string;
  title?: string;
  item = null;
  use: FormUse = 'filter';
  view: View = 'modal';
}

export class FilterModal2 {
  formId!: string;
  key!: string;
  title?: string;
  item = null;
  use: FormUse = 'filter';
  view: View = 'modal';
}

export class CatalogModal<T extends Entity | object, U extends EntityParams<U>> {
  key!: string;
  isCompact = true;
  mode!: CatalogMode;
  view: View = 'modal';
  title?: string;
  item: T | null = null;
  params!: U;
}

export type CatalogModalType<T extends Entity | object, U extends EntityParams<U> | object> = {
  key: string;
  isCompact: boolean;
  mode: CatalogMode;
  view: View;
  title: string;
  item: T | null;
  params: U;
}

export type DetailModalType<T extends Entity | object> = {
  use: FormUse;
  view: View;
  item: T | null;
  key: string | null;
  title: string;
}
