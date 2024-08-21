import { Component } from "@angular/core";
import { DetailModal, FilterModal, CatalogModal } from "src/app/_shared/table/table.module";
import { AddressesCatalogComponent } from "src/app/addresses/components/addresses-catalog.component";
import { AddressesFilterFormComponent } from "src/app/addresses/components/addresses-filter-form.component";
import { Address } from "src/app/addresses/addresses.config";
import { AddressDetailComponent } from "src/app/addresses/views";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";

@Component({
  selector: 'address-detail-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div addressDetail [id]="id" [use]="use" [view]="view" [key]="key" [item]="item"></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [AddressDetailComponent, ModalWrapperModule],
})
export class AddressDetailModalComponent extends DetailModal<Address> {}

@Component({
  selector: 'addresses-filter-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div addressesFilterForm [formId]="formId" [toggle]="false" [key]="key" [item]="item" [use]="use" [view]="view" [role]="'inline'" [mode]="'view'"></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [AddressesFilterFormComponent, ModalWrapperModule],
})
export class AddressesFilterModalComponent extends FilterModal {}

@Component({
  selector: 'addresses-catalog-modal',
  template: `
    @defer {
      <div modalContent>
        @if (title) {
          <div modalHeader [title]="title"></div>
        }
        <div modalBody>
          <div
            addressesCatalog
            class="modal-body py-3 px-4"
            [mode]="mode"
            [key]="key"
            [view]="view"
            [isCompact]="isCompact"
          ></div>
        </div>
      </div>
    }
  `,
  standalone: true,
  imports: [AddressesCatalogComponent, ModalWrapperModule],
})
export class AddressesCatalogModalComponent extends CatalogModal {}
