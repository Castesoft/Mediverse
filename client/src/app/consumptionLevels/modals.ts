import { Component } from "@angular/core";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { DetailModal, FilterModal, CatalogModal } from "src/app/_shared/table/table.module";
import { ConsumptionLevelsCatalogComponent } from "src/app/consumptionLevels/components/consumptionLevels-catalog.component";
import { ConsumptionLevelsFilterFormComponent } from "src/app/consumptionLevels/components/consumptionLevels-filter-form.component";
import { ConsumptionLevel } from "src/app/consumptionLevels/consumptionLevels.config";
import { ConsumptionLevelDetailComponent } from "src/app/consumptionLevels/views";

@Component({
  selector: 'edcuationLevelConsumptionLevel-detail-modal',
  template: `
  @defer {

    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div consumptionLevelDetail [id]="id" [use]="use" [view]="view" [key]="key" [item]="item"></div>
      </div>
    </div>

  }
  `,
  standalone: true,
  imports: [ConsumptionLevelDetailComponent, ModalWrapperModule],
})
export class ConsumptionLevelDetailModalComponent extends DetailModal<ConsumptionLevel> {}

@Component({
  selector: 'consumptionLevels-filter-modal',
  template: `
  @defer {

    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div consumptionLevelsFilterForm [formId]="formId" [toggle]="false" [key]="key" [item]="item" [use]="use" [view]="view" [role]="'inline'" [mode]="'view'"></div>
      </div>
    </div>

  }
  `,
  standalone: true,
  imports: [ConsumptionLevelsFilterFormComponent, ModalWrapperModule],
})
export class ConsumptionLevelsFilterModalComponent extends FilterModal {}

@Component({
  selector: 'consumptionLevels-catalog-modal',
  template: `
    @defer {
      <div modalContent>
        @if (title) {
          <div modalHeader [title]="title"></div>
        }
        <div modalBody>
          <div
            consumptionLevelsCatalog
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
  imports: [ConsumptionLevelsCatalogComponent, ModalWrapperModule],
})
export class ConsumptionLevelsCatalogModalComponent extends CatalogModal {}
