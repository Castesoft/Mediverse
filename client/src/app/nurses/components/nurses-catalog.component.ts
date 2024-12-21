import { CommonModule } from "@angular/common";
import { Component, OnDestroy, ModelSignal, model, effect } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseCatalog from "src/app/_models/base/components/extensions/baseCatalog";
import { View, CatalogMode } from "src/app/_models/base/types";
import { CatalogInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import Nurse from "src/app/_models/nurses/nurse";
import { NurseFiltersForm } from "src/app/_models/nurses/nurseFiltersForm";
import { NurseParams } from "src/app/_models/nurses/nurseParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { NursesTableComponent } from "src/app/nurses/components/nurses-table.component";
import { NursesService } from "src/app/nurses/nurses.config";

@Component({
  selector: '[nursesCatalog]',
  template: ``,
  templateUrl: './nurses-catalog.component.html',
  standalone: true,
  imports: [ FontAwesomeModule,
    NursesTableComponent, CommonModule,
    RouterModule, ControlsModule, TablesModule,
    CdkModule, MaterialModule, Forms2Module,
   ],
})
export class NursesCatalogComponent
  extends BaseCatalog<Nurse, NurseParams, NurseFiltersForm, NursesService>
  implements OnDestroy, CatalogInputSignals<Nurse, NurseParams>
{
  item: ModelSignal<Nurse | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<NurseParams> = model.required();


  constructor() {
    super(NursesService, NurseFiltersForm);

    effect(() => {
      this.form
        .setForm(this.params())
        .setValidation(this.validation.active())
      ;

      this.service.createEntry(this.key(), this.params(), this.mode());

      this.service.cache$.subscribe({
        next: cache => {
          this.service.loadPagedList(this.key(), this.params()).subscribe();
        }
      });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
