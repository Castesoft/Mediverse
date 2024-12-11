import { NgModule } from "@angular/core";
import { TableMenuCellComponent } from "./table-menu-cell.component";
import { TableCheckCellComponent } from "./table-check-cell.component";
import { TableCell2Component } from "./table-cell-2.component";
import { TableCellComponent } from "./table-cell.component";
import { TablePagerComponent } from './table-pager.component';
import { TableWrapperComponent } from "./table-wrapper.component";
import { TableHeaderComponent } from "src/app/_shared/template/components/tables/table-header.component";
import { TableLoadingPlaceholderComponent } from "src/app/_shared/template/components/tables/table-loading-placeholder.component";
import { TableHeaderCheckCellComponent } from "src/app/_shared/template/components/tables/table-header-check-cell.component";
import { TableBodyComponent } from "src/app/_shared/template/components/tables/table-body.component";

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
    TableHeaderCheckCellComponent,
    TableBodyComponent,
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
    TableHeaderCheckCellComponent,
    TableBodyComponent,
  ],
})
export class TablesModule {
}
