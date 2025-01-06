import { CommonModule } from "@angular/common";
import { Component, OnDestroy, ModelSignal, model, effect } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseCatalog from "src/app/_models/base/components/extensions/baseCatalog";
import { View, CatalogMode } from "src/app/_models/base/types";
import Clinic from "src/app/_models/clinics/clinic";
import ClinicFiltersForm from "src/app/_models/clinics/clinicFiltersForm";
import ClinicParams from "src/app/_models/clinics/clinicParams";
import { CatalogInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { ClinicsService } from "src/app/clinics/clinics.config";
import { ClinicsTableComponent } from "src/app/clinics/components/clinics-table.component";

@Component({
  selector: '[clinicsCatalog]',
  templateUrl: './clinics-catalog.component.html',
  standalone: true,
  imports: [ FontAwesomeModule,
    ClinicsTableComponent, CommonModule,
    RouterModule, ControlsModule, TablesModule,
    CdkModule, MaterialModule, Forms2Module,
   ],
})
export class ClinicsCatalogComponent
  extends BaseCatalog<Clinic, ClinicParams, ClinicFiltersForm, ClinicsService>
  implements OnDestroy, CatalogInputSignals<Clinic, ClinicParams>
{
  item: ModelSignal<Clinic | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<ClinicParams> = model.required();


  constructor() {
    super(ClinicsService, ClinicFiltersForm);

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
