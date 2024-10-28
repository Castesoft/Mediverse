import { NgModule } from '@angular/core';
import { FormUse, View, CatalogMode, Entity, Role } from 'src/app/_models/types';
import { TableHeaderComponent } from 'src/app/_shared/table/table-header.component';
import { TableLoadingPlaceholderComponent } from 'src/app/_shared/table/table-loading-placeholder.component';
import {
  TableCell2Component,
  TableCellComponent,
  TableCheckCellComponent,
  TableMenuCellComponent,
} from 'src/app/_shared/table/table-menu.component';
import { TablePagerComponent } from 'src/app/_shared/table/table-pager.component';
import { TableWrapperComponent } from 'src/app/_shared/table/table-wrapper.component';

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

export class DetailModal<T extends Entity | object> {
  id!: number;
  use!: FormUse;
  title?: string;
  key!: string;
  item!: T;
  view: View = 'modal';
}

export class FilterModal {
  formId!: string;
  key!: string;
  title?: string;
  item = null;
  use: FormUse = 'filter';
  view: View = 'modal';
}

export class CatalogModal {
  key!: string;
  mode!: CatalogMode;
  view: View = 'modal';
  title?: string;
  role: Role = 'Patient';
}
