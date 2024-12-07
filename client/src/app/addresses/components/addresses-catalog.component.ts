import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy, ModelSignal, model, effect } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Address } from "src/app/_models/addresses/address";
import { AddressFiltersForm } from "src/app/_models/addresses/addressFiltersForm";
import { AddressParams } from "src/app/_models/addresses/addressParams";
import { View, CatalogMode } from "src/app/_models/base/types";
import { BaseCatalog } from "src/app/_models/forms/extensions/baseFormComponent";
import { CatalogInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TableModule } from "src/app/_shared/table/table.module";
import { AddressesService } from "src/app/addresses/addresses.config";
import { AddressesTableComponent } from "src/app/addresses/components/addresses-table.component";

@Component({
  host: { class: 'mb-9', },
  selector: '[addressesCatalog]',
  template: ``,
  standalone: true,
  imports: [ FontAwesomeModule,
    AddressesTableComponent, CommonModule,
    RouterModule, ControlsModule, TableModule,
    CdkModule, MaterialModule,
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
    this.service.list$(this.key(), this.mode()).subscribe({ next: list => this.list.set(list) });
    this.service.pagination$(this.key()).subscribe({ next: pagination => this.pagination.set(pagination) });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
