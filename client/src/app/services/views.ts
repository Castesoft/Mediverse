import {Component, HostBinding, input, viewChild} from "@angular/core";
import { FormUse, Role, View } from "src/app/_models/types";
import { Service } from "src/app/_models/service";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ServiceFormComponent } from "src/app/services/components/service-form.component";
import { ServiceHeaderComponent } from "src/app/services/components/service-header.component";

@Component({
  selector: 'div[serviceNewView]',
  template: `
  <div serviceForm [use]="use()" [id]="null" [view]="view()" [style]="'normal'"></div>
  `,
  standalone: true,
  imports: [ ServiceFormComponent, ModalWrapperModule, ServiceHeaderComponent, ],
})
export class ServiceNewComponent {
  use = input.required<FormUse>();
  view = input.required<View>();

  formComponent = viewChild.required(ServiceFormComponent);

  @HostBinding('class') get hostClass() {
    if (this.view() === 'page') {
      return 'card';
    }
    else return '';
  }

  onFillForm = () => this.formComponent().fillForm();
}

@Component({
  selector: 'div[serviceDetailView]',
  template: `
  `,
  standalone: true,
  imports: [ServiceFormComponent, ServiceHeaderComponent],
})
export class ServiceDetailComponent {
  id = input.required<number>();
  use = input.required<FormUse>();
  view = input.required<View>();
  item = input.required<Service>();
  key = input.required<string | undefined>();

  @HostBinding('class') get hostClass() {
    if (this.view() === 'page') {
      return 'card';
    }
    else return '';
  }
}

@Component({
  selector: 'div[serviceEditView]',
  template: `
  <div serviceForm [use]="use()" [id]="id()" [view]="view()" [style]="'normal'"></div>
  `,
  standalone: true,
  imports: [ ServiceFormComponent, ModalWrapperModule, ServiceHeaderComponent, ],
})
export class ServiceEditComponent {
  id = input.required<number>();
  use = input.required<FormUse>();
  view = input.required<View>();
  item = input.required<Service>();
  key = input.required<string | undefined>();

  @HostBinding('class') get hostClass() {
    if (this.view() === 'page') {
      return 'card';
    }
    else return '';
  }
}
