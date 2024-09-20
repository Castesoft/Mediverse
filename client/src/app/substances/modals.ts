import { Component } from "@angular/core";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { DetailModal, FilterModal, CatalogModal } from "src/app/_shared/table/table.module";
import { SubstancesCatalogComponent } from "src/app/substances/components/substances-catalog.component";
import { SubstancesFilterFormComponent } from "src/app/substances/components/substances-filter-form.component";
import { Substance } from "src/app/substances/substances.config";
import { SubstanceDetailComponent } from "src/app/substances/views";

@Component({
  selector: 'substance-detail-modal',
  template: `
  @defer {

    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div substanceDetail [id]="id" [use]="use" [view]="view" [key]="key" [item]="item"></div>
      </div>
    </div>

  }
  `,
  standalone: true,
  imports: [SubstanceDetailComponent, ModalWrapperModule],
})
export class SubstanceDetailModalComponent extends DetailModal<Substance> {}

@Component({
  selector: 'substances-filter-modal',
  template: `
  @defer {

    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div substancesFilterForm [formId]="formId" [toggle]="false" [key]="key" [item]="item" [use]="use" [view]="view" [role]="'inline'" [mode]="'view'"></div>
      </div>
    </div>

  }
  `,
  standalone: true,
  imports: [SubstancesFilterFormComponent, ModalWrapperModule],
})
export class SubstancesFilterModalComponent extends FilterModal {}

@Component({
  selector: 'substances-catalog-modal',
  template: `
    @defer {
      <div modalContent>
        @if (title) {
          <div modalHeader [title]="title"></div>
        }
        <div modalBody>
          <div
            substancesCatalog
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
  imports: [SubstancesCatalogComponent, ModalWrapperModule],
})
export class SubstancesCatalogModalComponent extends CatalogModal {}
