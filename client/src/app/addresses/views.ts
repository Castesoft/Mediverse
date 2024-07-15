import {Component, HostBinding, input, viewChild} from "@angular/core";
import { Addresses, FormUse, View } from "src/app/_models/types";
import { Address } from "src/app/_models/address";
import {LayoutModule} from "src/app/_shared/layout.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { AddressFormComponent } from "src/app/addresses/components/address-form.component";

@Component({
  selector: 'div[addressNewView]',
  template: `
  <div addressForm [use]="use()" [id]="null" [view]="view()" [type]="type()" [style]="'normal'"></div>
  `,
  standalone: true,
  imports: [ AddressFormComponent, ModalWrapperModule, ],
})
export class AddressNewComponent {
  use = input.required<FormUse>();
  view = input.required<View>();
  type = input.required<Addresses>();

  @HostBinding('class') get hostClass() {
    if (this.view() === 'page') {
      return 'card';
    }
    else return '';
  }

  formComponent = viewChild.required(AddressFormComponent);

  onFillForm = () => this.formComponent().fillForm();
}

@Component({
  selector: 'div[addressDetailView]',
  template: `
  `,
  standalone: true,
  imports: [AddressFormComponent],
})
export class AddressDetailComponent {
  id = input.required<number>();
  use = input.required<FormUse>();
  view = input.required<View>();
  item = input.required<Address>();
  key = input.required<string | undefined>();
  type = input.required<Addresses>();

  @HostBinding('class') get hostClass() {
    if (this.view() === 'page') {
      return 'card';
    }
    else return '';
  }
}

@Component({
  selector: 'div[addressEditView]',
  template: `
  <div addressForm [use]="use()" [id]="id()" [view]="view()" [type]="type()" [style]="'normal'"></div>
  `,
  standalone: true,
  imports: [ AddressFormComponent, ModalWrapperModule, LayoutModule, ],
})
export class AddressEditComponent {
  id = input.required<number>();
  use = input.required<FormUse>();
  view = input.required<View>();
  item = input.required<Address>();
  key = input.required<string | undefined>();
  type = input.required<Addresses>();

  @HostBinding('class') get hostClass() {
    if (this.view() === 'page') {
      return 'card';
    }
    else return '';
  }

}


