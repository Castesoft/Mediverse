import { Component } from "@angular/core";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { DetailModal, FilterModal, CatalogModal } from "src/app/_shared/table/table.module";
import { OccupationsCatalogComponent } from "src/app/occupations/components/occupations-catalog.component";
import { OccupationsFilterFormComponent } from "src/app/occupations/components/occupations-filter-form.component";
import { Occupation } from "src/app/occupations/occupations.config";
import { OccupationDetailComponent } from "src/app/occupations/views";

@Component({
  selector: 'occupation-detail-modal',
  template: `
  @defer {

    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div occupationDetail [id]="id" [use]="use" [view]="view" [key]="key" [item]="item"></div>
      </div>
    </div>
  
  }
  `,
  standalone: true,
  imports: [OccupationDetailComponent, ModalWrapperModule],
})
export class OccupationDetailModalComponent extends DetailModal<Occupation> {}

@Component({
  selector: 'occupations-filter-modal',
  template: `
  @defer {

    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div occupationsFilterForm [formId]="formId" [toggle]="false" [key]="key" [item]="item" [use]="use" [view]="view" [role]="'inline'" [mode]="'view'"></div>
      </div>
    </div>

  }
  `,
  standalone: true,
  imports: [OccupationsFilterFormComponent, ModalWrapperModule],
})
export class OccupationsFilterModalComponent extends FilterModal {}

@Component({
  selector: 'occupations-catalog-modal',
  template: `
    @defer {
      <div modalContent>
        @if (title) {
          <div modalHeader [title]="title"></div>
        }
        <div modalBody>
          <div
            occupationsCatalog
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
  imports: [OccupationsCatalogComponent, ModalWrapperModule],
})
export class OccupationsCatalogModalComponent extends CatalogModal {}
