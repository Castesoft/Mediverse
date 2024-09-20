import { Component } from "@angular/core";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { DetailModal, FilterModal, CatalogModal } from "src/app/_shared/table/table.module";
import { ColorBlindnessesCatalogComponent } from "src/app/colorBlindnesses/components/colorBlindnesses-catalog.component";
import { ColorBlindnessesFilterFormComponent } from "src/app/colorBlindnesses/components/colorBlindnesses-filter-form.component";
import { ColorBlindness } from "src/app/colorBlindnesses/colorBlindnesses.config";
import { ColorBlindnessDetailComponent } from "src/app/colorBlindnesses/views";

@Component({
  selector: 'colorBlindness-detail-modal',
  template: `
  @defer {

    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div colorBlindnessDetail [id]="id" [use]="use" [view]="view" [key]="key" [item]="item"></div>
      </div>
    </div>

  }
  `,
  standalone: true,
  imports: [ColorBlindnessDetailComponent, ModalWrapperModule],
})
export class ColorBlindnessDetailModalComponent extends DetailModal<ColorBlindness> {}

@Component({
  selector: 'colorBlindnesses-filter-modal',
  template: `
  @defer {

    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div colorBlindnessesFilterForm [formId]="formId" [toggle]="false" [key]="key" [item]="item" [use]="use" [view]="view" [role]="'inline'" [mode]="'view'"></div>
      </div>
    </div>

  }
  `,
  standalone: true,
  imports: [ColorBlindnessesFilterFormComponent, ModalWrapperModule],
})
export class ColorBlindnessesFilterModalComponent extends FilterModal {}

@Component({
  selector: 'colorBlindnesses-catalog-modal',
  template: `
    @defer {
      <div modalContent>
        @if (title) {
          <div modalHeader [title]="title"></div>
        }
        <div modalBody>
          <div
            colorBlindnessesCatalog
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
  imports: [ColorBlindnessesCatalogComponent, ModalWrapperModule],
})
export class ColorBlindnessesCatalogModalComponent extends CatalogModal {}
