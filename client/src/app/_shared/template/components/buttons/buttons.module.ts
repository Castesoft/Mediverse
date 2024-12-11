import { NgModule } from "@angular/core";
import { CreateBtnComponent } from "src/app/_shared/template/components/buttons/create-btn.component";
import { DeleteSelectedBtnComponent } from "src/app/_shared/template/components/buttons/delete-selected-btn.component";
import { ExportBtnComponent } from "src/app/_shared/template/components/buttons/export-btn.component";
import { FilterMenuBtnComponent } from "src/app/_shared/template/components/buttons/filter-menu-btn.component";

@NgModule({
  imports: [
    CreateBtnComponent,
    DeleteSelectedBtnComponent,
    ExportBtnComponent,
    FilterMenuBtnComponent,
  ],
  exports: [
    CreateBtnComponent,
    DeleteSelectedBtnComponent,
    ExportBtnComponent,
    FilterMenuBtnComponent,
  ]
})
export class ButtonsModule {}
