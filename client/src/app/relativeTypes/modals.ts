import { Component } from "@angular/core";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { DetailModal, FilterModal, CatalogModal } from "src/app/_shared/table/table.module";
import { RelativeTypesCatalogComponent } from "src/app/relativeTypes/components/relativeTypes-catalog.component";
import { RelativeTypesFilterFormComponent } from "src/app/relativeTypes/components/relativeTypes-filter-form.component";
import { RelativeType } from "src/app/relativeTypes/relativeTypes.config";
import { RelativeTypeDetailComponent } from "src/app/relativeTypes/views";

@Component({
  selector: 'relativeType-detail-modal',
  template: `
  @defer {

    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div relativeTypeDetail [id]="id" [use]="use" [view]="view" [key]="key" [item]="item"></div>
      </div>
    </div>

  }
  `,
  standalone: true,
  imports: [RelativeTypeDetailComponent, ModalWrapperModule],
})
export class RelativeTypeDetailModalComponent extends DetailModal<RelativeType> {}

@Component({
  selector: 'relativeTypes-filter-modal',
  template: `
  @defer {

    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div relativeTypesFilterForm [formId]="formId" [toggle]="false" [key]="key" [item]="item" [use]="use" [view]="view" [role]="'inline'" [mode]="'view'"></div>
      </div>
    </div>

  }
  `,
  standalone: true,
  imports: [RelativeTypesFilterFormComponent, ModalWrapperModule],
})
export class RelativeTypesFilterModalComponent extends FilterModal {}

@Component({
  selector: 'relativeTypes-catalog-modal',
  template: `
    @defer {
      <div modalContent>
        @if (title) {
          <div modalHeader [title]="title"></div>
        }
        <div modalBody>
          <div
            relativeTypesCatalog
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
  imports: [RelativeTypesCatalogComponent, ModalWrapperModule],
})
export class RelativeTypesCatalogModalComponent extends CatalogModal {}
