import { NgModule } from "@angular/core";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";
import { TableLoadingPlaceholderComponent } from "src/app/_shared/table/table-loading-placeholder.component";
import { TablePagerComponent } from "src/app/_shared/table/table-pager.component";
import { TableWrapperComponent } from "src/app/_shared/table/table-wrapper.component";

@NgModule({
  imports: [TableWrapperComponent, TableHeaderComponent, TablePagerComponent, TableLoadingPlaceholderComponent,],
  exports: [TableWrapperComponent, TableHeaderComponent, TablePagerComponent, TableLoadingPlaceholderComponent,],
})
export class TableModule {}
