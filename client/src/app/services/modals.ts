import { Component, inject, OnInit, viewChild } from "@angular/core";
import { CatalogMode, FormUse, Role, View } from "src/app/_models/types";
import { Service } from "src/app/_models/service";
import { ServicesService } from "src/app/_services/services.service";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ServicesCatalogComponent } from "src/app/services/components/services-catalog.component";
import { ServicesFilterFormComponent } from "src/app/services/components/services-filter-form.component";
import { ServiceDetailComponent, ServiceEditComponent, ServiceNewComponent } from "src/app/services/views";

@Component({
  selector: 'service-edit-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div
          serviceEditView
          [id]="id"
          [use]="use"
          [view]="'modal'"
          [key]="undefined"
          [item]="item"

        ></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ServiceEditComponent, ModalWrapperModule],
})
export class ServiceEditModalComponent {
  id!: number;
  use!: FormUse;
  title?: string;
  item!: Service;

}

@Component({
  selector: 'service-edit-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div
          serviceDetailView
          [id]="id"
          [use]="use"
          [view]="'modal'"
          [key]="key"
          [item]="item"

        ></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ServiceDetailComponent, ModalWrapperModule],
})
export class ServiceDetailModalComponent {
  id!: number;
  use!: FormUse;
  title?: string;
  key!: string;
  item!: Service;

}

@Component({
  selector: 'service-new-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div serviceNewView [use]="use" [view]="'modal'" ></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ServiceNewComponent, ModalWrapperModule],
})
export class ServiceNewModalComponent {
  use!: FormUse;
  title?: string;

}

@Component({
  selector: 'services-filter-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div servicesFilterForm [key]="key" [formId]="formId" ></div>
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
  imports: [ServicesFilterFormComponent, ModalWrapperModule],
})
export class ServicesFilterModalComponent implements OnInit {
  service = inject(ServicesService);

  formId!: string;
  key!: string;

  title?: string;

  form = viewChild.required(ServicesFilterFormComponent);

  onReset = () =>
    this.form()!.service.resetForm(this.key, this.form()!.form);
  onSubmit = () => this.form()!.onSubmit();

  ngOnInit(): void {
    this.formId = this.form().form.id;
  }
}

@Component({
  selector: 'services-catalog-modal',
  template: `
    @defer {
      <div modalContent>
        @if (title) {
          <div modalHeader [title]="title"></div>
        }
        <div modalBody>
          <div
            servicesCatalog
            class="modal-body py-3 px-4"
            [mode]="mode"
            [key]="key"
            [view]="view"
          ></div>
        </div>
      </div>
    }
  `,
  standalone: true,
  imports: [ServicesCatalogComponent, ModalWrapperModule],
})
export class ServicesCatalogModalComponent {
  key!: string;

  isCompact = true;
  mode!: CatalogMode;
  view: View = 'modal';
  title?: string;
}
