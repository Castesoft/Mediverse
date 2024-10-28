import { Component, inject, input, model, OnInit } from '@angular/core';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { ProductParams, ProductsFilterForm } from 'src/app/_models/product';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { IconsService } from 'src/app/_services/icons.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchTextComponent } from 'src/app/_forms/search-text.component';
import { SearchDateRangeComponent } from 'src/app/_forms/search-date-range.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { ControlMultiselectComponent } from 'src/app/_forms/control-multiselect.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ProductsFilterModalComponent } from 'src/app/products/modals';
import { ProductsService } from 'src/app/_services/products.service';

@Component({
  selector: 'div[productsFilterForm]',
  template: `
  <form
      [id]="form.id"
      (ngSubmit)="onSubmit()"
    >
    <div
        searchText
        class="mb-3"
        formControlName="search"
        [label]="'Buscar ' + service.dictionary.plural"
        [placeholder]="'Buscar ' + service.dictionary.plural"
      ></div>
      <div
        searchDateRange
        class="mb-3"
        formControlName="dateRange"
        [label]="'Fecha de creación'"
      ></div>
      <div class="mb-3">
        <div class="row row-cols-2 g-3">
          <div class="col">
            <div
              inputControl [optional]="false"
              formControlName="pageSize"
              [label]="'Tamaño de página'"
              [placeholder]="'Tamaño de página'"
              [type]="'number'"
              [errors]="{
                min: 'El valor mínimo es 1.',
                max: 'El valor máximo es 50.',
              }"
            ></div>
          </div>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-link px-0"
        (click)="isAdvancedFiltersCollapsed = !isAdvancedFiltersCollapsed"
        [attr.aria-expanded]="!isAdvancedFiltersCollapsed"
        aria-controls="collapseBasic"
      >
        <fa-icon
          [icon]="isAdvancedFiltersCollapsed ? icons.faPlus : icons.faMinus"
        />
        Filtros avanzados
      </button>
    </form>
  `,
  standalone: true,
  imports: [ ModalModule, FontAwesomeModule, ReactiveFormsModule, SearchTextComponent, SearchDateRangeComponent, InputControlComponent, ControlMultiselectComponent, CollapseModule,  ],
})
export class ProductsFilterFormComponent {
  service = inject(ProductsService);
  icons = inject(IconsService);

  key = model.required<string>();
  formId = input.required<string>();

  modalRef: BsModalRef<ProductsFilterModalComponent> = new BsModalRef<ProductsFilterModalComponent>();

  form = new ProductsFilterForm();
  params!: ProductParams;

  isAdvancedFiltersCollapsed = true;
  isTextFiltersCollapsed = true;
  isCategoricalFiltersCollapsed = true;
  isDateFiltersCollapsed = true;
  isNumericalFiltersCollapsed = true;
  isLoading = true;
  private ngUnsubscribe = new Subject<void>();

  resetMultiselects= false;

  constructor() {}

  onCancel(): void {

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {

  }

}
