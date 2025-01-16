import { CommonModule } from "@angular/common";
import { Component, OnDestroy, ModelSignal, model, effect, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseCatalog from "src/app/_models/base/components/extensions/baseCatalog";
import { View, CatalogMode } from "src/app/_models/base/types";
import { CatalogInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { AddressesTableComponent } from "src/app/addresses/components/addresses-table.component";
import { AddressesService } from "src/app/addresses/addresses.config";
import { Address } from "src/app/_models/addresses/address";
import { AddressParams } from "src/app/_models/addresses/addressParams";
import { AddressFiltersForm } from "src/app/_models/addresses/addressFiltersForm";
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  selector: '[addressesCatalog]',
  templateUrl: './addresses-catalog.component.html',
  standalone: true,
  imports: [
    FontAwesomeModule,
    AddressesTableComponent,
    CommonModule,
    RouterModule,
    ControlsModule,
    TablesModule,
    CdkModule,
    MaterialModule,
    Forms2Module,
  ],
})
export class AddressesCatalogComponent extends BaseCatalog<Address, AddressParams, AddressFiltersForm, AddressesService> implements OnDestroy, CatalogInputSignals<Address, AddressParams> {
  item: ModelSignal<Address | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<AddressParams> = model.required();

  constructor() {
    super(AddressesService, AddressFiltersForm);

    effect((): void => {
      this.form
        .setForm(this.params())
        .setValidation(this.validation.active());

      this.service
        .loadPagedList(this.key(), this.params())
        .subscribe();
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  protected readonly FormUse = FormUse;
}
