import { Component } from "@angular/core";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { DetailModal, FilterModal, CatalogModal } from "src/app/_shared/table/table.module";
import { EducationLevelsCatalogComponent } from "src/app/educationLevels/components/educationLevels-catalog.component";
import { EducationLevelsFilterFormComponent } from "src/app/educationLevels/components/educationLevels-filter-form.component";
import { EducationLevel } from "src/app/educationLevels/educationLevels.config";
import { EducationLevelDetailComponent } from "src/app/educationLevels/views";

@Component({
  selector: 'edcuationLevelEducationLevel-detail-modal',
  template: `
  @defer {

    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div educationLevelDetail [id]="id" [use]="use" [view]="view" [key]="key" [item]="item"></div>
      </div>
    </div>

  }
  `,
  standalone: true,
  imports: [EducationLevelDetailComponent, ModalWrapperModule],
})
export class EducationLevelDetailModalComponent extends DetailModal<EducationLevel> {}

@Component({
  selector: 'educationLevels-filter-modal',
  template: `
  @defer {

    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div educationLevelsFilterForm [formId]="formId" [toggle]="false" [key]="key" [item]="item" [use]="use" [view]="view" [role]="'inline'" [mode]="'view'"></div>
      </div>
    </div>

  }
  `,
  standalone: true,
  imports: [EducationLevelsFilterFormComponent, ModalWrapperModule],
})
export class EducationLevelsFilterModalComponent extends FilterModal {}

@Component({
  selector: 'educationLevels-catalog-modal',
  template: `
    @defer {
      <div modalContent>
        @if (title) {
          <div modalHeader [title]="title"></div>
        }
        <div modalBody>
          <div
            educationLevelsCatalog
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
  imports: [EducationLevelsCatalogComponent, ModalWrapperModule],
})
export class EducationLevelsCatalogModalComponent extends CatalogModal {}
