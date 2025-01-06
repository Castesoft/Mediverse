import { CommonModule } from "@angular/common";
import { Component, OnDestroy, ModelSignal, model, effect } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseCatalog from "src/app/_models/base/components/extensions/baseCatalog";
import { View, CatalogMode } from "src/app/_models/base/types";
import { CatalogInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { Service } from "src/app/_models/services/service";
import { ServiceFiltersForm } from "src/app/_models/services/serviceFiltersForm";
import { ServiceParams } from "src/app/_models/services/serviceParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { ServicesTableComponent } from "src/app/services/components/services-table.component";
import { ServicesService } from "src/app/services/services.config";

@Component({
  selector: '[servicesCatalog]',
  templateUrl: './services-catalog.component.html',
  standalone: true,
  imports: [ FontAwesomeModule,
    ServicesTableComponent, CommonModule,
    RouterModule, ControlsModule, TablesModule,
    CdkModule, MaterialModule, Forms2Module,
   ],
})
export class ServicesCatalogComponent
  extends BaseCatalog<Service, ServiceParams, ServiceFiltersForm, ServicesService>
  implements OnDestroy, CatalogInputSignals<Service, ServiceParams>
{
  item: ModelSignal<Service | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<ServiceParams> = model.required();


  constructor() {
    super(ServicesService, ServiceFiltersForm);

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
