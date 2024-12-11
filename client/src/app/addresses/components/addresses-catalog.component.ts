import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy, ModelSignal, model, input, effect } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { Address } from "src/app/_models/addresses/address";
import { AddressFiltersForm } from "src/app/_models/addresses/addressFiltersForm";
import { AddressParams } from "src/app/_models/addresses/addressParams";
import BaseCatalog from "src/app/_models/base/components/extensions/baseCatalog";
import { View, CatalogMode } from "src/app/_models/base/types";
import { CatalogInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { AddressesService } from "src/app/addresses/addresses.config";
import { AddressesTableComponent } from "src/app/addresses/components/addresses-table.component";

@Component({
  selector: '[addressesCatalog]',
  // template: ``,
  templateUrl: './addresses-catalog.component.html',
  standalone: true,
  imports: [ FontAwesomeModule,
    AddressesTableComponent, CommonModule,
    RouterModule, ControlsModule, TablesModule,
    CdkModule, MaterialModule, Forms2Module,
   ],
})
export class AddressesCatalogComponent
  extends BaseCatalog<Address, AddressParams, AddressFiltersForm, AddressesService>
  implements OnInit, OnDestroy, CatalogInputSignals<Address, AddressParams>
{
  item: ModelSignal<Address | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<AddressParams> = model.required();


  constructor() {
    super(AddressesService, AddressFiltersForm);

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

  ngOnInit(): void {
    // this.service.param$(this.key(), this.mode()).subscribe({ next: params => this.params = params });
    this.service.list$(this.key(), this.mode()).subscribe({ next: list => this.list.set(list) });
    this.service.pagination$(this.key()).subscribe({ next: pagination => this.pagination.set(pagination) });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
