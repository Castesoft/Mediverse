import { Component, inject, OnInit, viewChild } from "@angular/core";
import { Addresses, CatalogMode, FormUse, Role, View } from "src/app/_models/types";
import { Address } from "src/app/_models/address";
import { AddressesService } from "src/app/_services/addresses.service";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { AddressesCatalogComponent } from "src/app/addresses/components/addresses-catalog.component";
import { AddressesFilterFormComponent } from "src/app/addresses/components/addresses-filter-form.component";
import { AddressDetailComponent, AddressEditComponent, AddressNewComponent } from "src/app/addresses/views";

@Component({
  selector: 'address-edit-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div
          addressEditView
          [id]="id"
          [use]="use"
          [view]="'modal'"
          [key]="undefined"
          [item]="item"
          [type]="type"
        ></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [AddressEditComponent, ModalWrapperModule],
})
export class AddressEditModalComponent {
  id!: number;
  use!: FormUse;
  title?: string;
  item!: Address;
  type!: Addresses;
}

@Component({
  selector: 'address-edit-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div
          addressDetailView
          [id]="id"
          [use]="use"
          [view]="'modal'"
          [key]="key"
          [item]="item"
          [type]="type"
        ></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [AddressDetailComponent, ModalWrapperModule],
})
export class AddressDetailModalComponent {
  id!: number;
  use!: FormUse;
  title?: string;
  key!: string;
  item!: Address;
  type!: Addresses;
}

@Component({
  selector: 'address-new-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div addressNewView [use]="use" [view]="'modal'" [type]="type"></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [AddressNewComponent, ModalWrapperModule],
})
export class AddressNewModalComponent {
  use!: FormUse;
  title?: string;
  type!: Addresses;
}

@Component({
  selector: 'addresses-filter-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div filterForm [key]="key" [formId]="formId" [type]="type"></div>
      </div>
      <div
        modalFooterFilters
        [formId]="formId"
        (onReset)="onReset()"
        (onSubmit)="onSubmit()"
      ></div>
    </div>
  `,
  standalone: true,
  imports: [AddressesFilterFormComponent, ModalWrapperModule],
})
export class AddressesFilterModalComponent implements OnInit {
  service = inject(AddressesService);

  formId!: string;
  key!: string;
  type!: Addresses;
  title?: string;

  form = viewChild.required(AddressesFilterFormComponent);

  onReset = () =>
    this.form()!.service.resetForm(this.key, this.form()!.form);
  onSubmit = () => this.form()!.onSubmit();

  ngOnInit(): void {
    this.formId = this.form().form.id;
  }
}

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
            [type]="type"
            [key]="key"
            [view]="view"
          ></div>
        </div>
      </div>
    }
  `,
  standalone: true,
  imports: [AddressesCatalogComponent, ModalWrapperModule],
})
export class AddressesCatalogModalComponent {
  key!: string;
  type!: Addresses;
  isCompact = true;
  mode!: CatalogMode;
  view: View = 'modal';
  title?: string;
}
