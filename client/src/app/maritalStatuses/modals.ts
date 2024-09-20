import { Component } from "@angular/core";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { DetailModal, FilterModal, CatalogModal } from "src/app/_shared/table/table.module";
import { MaritalStatusesCatalogComponent } from "src/app/maritalStatuses/components/maritalStatuses-catalog.component";
import { MaritalStatusesFilterFormComponent } from "src/app/maritalStatuses/components/maritalStatuses-filter-form.component";
import { MaritalStatus } from "src/app/maritalStatuses/maritalStatuses.config";
import { MaritalStatusDetailComponent } from "src/app/maritalStatuses/views";

@Component({
  selector: 'maritalStatus-detail-modal',
  template: `
  @defer {

    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div maritalStatusDetail [id]="id" [use]="use" [view]="view" [key]="key" [item]="item"></div>
      </div>
    </div>

  }
  `,
  standalone: true,
  imports: [MaritalStatusDetailComponent, ModalWrapperModule],
})
export class MaritalStatusDetailModalComponent extends DetailModal<MaritalStatus> {}

@Component({
  selector: 'maritalStatuses-filter-modal',
  template: `
  @defer {

    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div maritalStatusesFilterForm [formId]="formId" [toggle]="false" [key]="key" [item]="item" [use]="use" [view]="view" [role]="'inline'" [mode]="'view'"></div>
      </div>
    </div>

  }
  `,
  standalone: true,
  imports: [MaritalStatusesFilterFormComponent, ModalWrapperModule],
})
export class MaritalStatusesFilterModalComponent extends FilterModal {}

@Component({
  selector: 'maritalStatuses-catalog-modal',
  template: `
    @defer {
      <div modalContent>
        @if (title) {
          <div modalHeader [title]="title"></div>
        }
        <div modalBody>
          <div
            maritalStatusesCatalog
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
  imports: [MaritalStatusesCatalogComponent, ModalWrapperModule],
})
export class MaritalStatusesCatalogModalComponent extends CatalogModal {}
