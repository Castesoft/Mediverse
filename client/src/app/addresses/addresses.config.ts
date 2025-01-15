import { CommonModule } from "@angular/common";
import { Component, inject, Injectable, ModelSignal, model, effect } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { Address } from "src/app/_models/addresses/address";
import { addressDictionary, addressColumns } from "src/app/_models/addresses/addressConstants";
import { AddressFiltersForm } from "src/app/_models/addresses/addressFiltersForm";
import { AddressForm } from "src/app/_models/addresses/addressForm";
import { AddressParams } from "src/app/_models/addresses/addressParams";
import BaseDetail from "src/app/_models/base/components/extensions/baseDetail";
import BaseForm from "src/app/_models/base/components/extensions/baseForm";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { CatalogMode, View } from "src/app/_models/base/types";
import { ZipcodeAddressOption } from "src/app/_models/billingDetails";
import { FormInputSignals, DetailInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { FormUse } from "src/app/_models/forms/formTypes";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { AddressesCatalogComponent } from "src/app/addresses/components/addresses-catalog.component";

@Component({
  selector: 'addresses-catalog-modal',
  template: `
  @defer {
    <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
    <mat-dialog-content>
    <div
      addressesCatalog
      [(mode)]="data.mode"
      [(key)]="data.key"
      [(view)]="data.view"
      [(isCompact)]="data.isCompact"
      [(item)]="data.item"
      [(params)]="data.params"
    ></div>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button mat-dialog-close>Cerrar</button>
  </mat-dialog-actions>
}
`,
  standalone: true,
  imports: [AddressesCatalogComponent, MaterialModule, CdkModule,],
})
export class AddressesCatalogModalComponent {
  data = inject<CatalogDialog<Address, AddressParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root',
})
export class AddressesService extends ServiceHelper<Address, AddressParams, FormGroup2<AddressParams>> {
  constructor() {
    super(AddressParams, 'addresses', addressDictionary, addressColumns);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      AddressesCatalogModalComponent,
      CatalogDialog<Address, AddressParams>
    >(AddressesCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new AddressParams(key),
        view: view,
        title: this.dictionary.title,
        item: null,
      },
      disableClose: true,
      hasBackdrop: false,
      panelClass: [ "window" ]
    });
  };


  getAddressesByZipcode(zipcode: string) {
    return this.http.get<ZipcodeAddressOption[]>(`${this.baseUrl}zipcodes/${zipcode}`);
  }

}

@Component({
  selector: "[addressForm]",
  templateUrl: './address-form.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ControlsModule, Forms2Module,]
})
export class AddressFormComponent
  extends BaseForm<
    Address, AddressParams, AddressFiltersForm, AddressForm, AddressesService
  >
  implements FormInputSignals<Address> {
  item: ModelSignal<Address | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();

  constructor() {
    super(AddressesService, AddressForm);

    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active());

      const value = this.item();

      if (value !== null) {
        this.form.patchValue(value);
      }
    });
  }
}

@Component({
  selector: 'div[addressDetail]',
  template: `
  <div container3 [type]="'inline'">
    <!-- <div detailHeader [(use)]="use" [(view)]="view" [(dictionary)]="service.dictionary" [id]="item() !== null ? item()!.id : null" (onDelete)="service.delete$(item()!)"></div> -->
  </div>
  <div addressForm [(item)]="item" [(key)]="key" [(use)]="use" [(view)]="view"></div>
  `,
  standalone: true,
  imports: [AddressFormComponent, ControlsModule, Forms2Module,],
})
export class AddressDetailComponent
  extends BaseDetail<Address, AddressParams, AddressFiltersForm, AddressesService>
  implements DetailInputSignals<Address>
{
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Address | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();

  constructor() {
    super(AddressesService);
  }

}

@Component({
  selector: 'address-detail-modal',
  template: `
  @defer {
    <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
    <mat-dialog-content>
    <div
      addressDetail
      [(use)]="data.use"
      [(view)]="data.view"
      [(key)]="data.key"
      [(item)]="data.item"
      [(title)]="data.title"
    ></div>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button mat-dialog-close>Cerrar</button>
  </mat-dialog-actions>
}
`,
  standalone: true,
  imports: [AddressDetailComponent, ModalWrapperModule, MaterialModule, CdkModule,],
})
export class AddressDetailModalComponent {
  data = inject<DetailDialog<Address>>(MAT_DIALOG_DATA);
}
