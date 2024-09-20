import { Component } from "@angular/core";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { DetailModal, FilterModal, CatalogModal } from "src/app/_shared/table/table.module";
import { DiseasesCatalogComponent } from "src/app/diseases/components/diseases-catalog.component";
import { DiseasesFilterFormComponent } from "src/app/diseases/components/diseases-filter-form.component";
import { Disease } from "src/app/diseases/diseases.config";
import { DiseaseDetailComponent } from "src/app/diseases/views";

@Component({
  selector: 'disease-detail-modal',
  template: `
  @defer {

    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div diseaseDetail [id]="id" [use]="use" [view]="view" [key]="key" [item]="item"></div>
      </div>
    </div>

  }
  `,
  standalone: true,
  imports: [DiseaseDetailComponent, ModalWrapperModule],
})
export class DiseaseDetailModalComponent extends DetailModal<Disease> {}

@Component({
  selector: 'diseases-filter-modal',
  template: `
  @defer {

    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div diseasesFilterForm [formId]="formId" [toggle]="false" [key]="key" [item]="item" [use]="use" [view]="view" [role]="'inline'" [mode]="'view'"></div>
      </div>
    </div>

  }
  `,
  standalone: true,
  imports: [DiseasesFilterFormComponent, ModalWrapperModule],
})
export class DiseasesFilterModalComponent extends FilterModal {}

@Component({
  selector: 'diseases-catalog-modal',
  template: `
    @defer {
      <div modalContent>
        @if (title) {
          <div modalHeader [title]="title"></div>
        }
        <div modalBody>
          <div
            diseasesCatalog
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
  imports: [DiseasesCatalogComponent, ModalWrapperModule],
})
export class DiseasesCatalogModalComponent extends CatalogModal {}
