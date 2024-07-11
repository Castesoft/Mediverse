import { Component, inject, input, OnInit } from '@angular/core';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { FilterForm, EventParams } from 'src/app/_models/event';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Role } from 'src/app/_models/types';
import { IconsService } from 'src/app/_services/icons.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchTextComponent } from 'src/app/_forms/search-text.component';
import { SearchDateRangeComponent } from 'src/app/_forms/search-date-range.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { ControlMultiselectComponent } from 'src/app/_forms/control-multiselect.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { EventsFilterModalComponent } from 'src/app/events/modals';
import { EventsService } from 'src/app/_services/events.service';

@Component({
  selector: 'div[filterForm]',
  template: `
  <form
      [formGroup]="form.group"
      [id]="form.id"
      (ngSubmit)="onSubmit()"
    >
    <div
        searchText
        class="mb-3"
        formControlName="search"
        [label]="'Buscar ' + service.naming!.plural"
        [placeholder]="'Buscar ' + service.naming!.plural"
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
export class EventsFilterFormComponent implements OnInit {
  service = inject(EventsService);
  icons = inject(IconsService);

  key = input.required<string>();
  formId = input.required<string>();

  modalRef: BsModalRef<EventsFilterModalComponent> = new BsModalRef<EventsFilterModalComponent>();

  form = new FilterForm();
  params!: EventParams;

  isAdvancedFiltersCollapsed = true;
  isTextFiltersCollapsed = true;
  isCategoricalFiltersCollapsed = true;
  isDateFiltersCollapsed = true;
  isNumericalFiltersCollapsed = true;
  isLoading = true;
  private ngUnsubscribe = new Subject<void>();

  resetMultiselects= false;

  ngOnInit(): void {
    this.params = new EventParams(this.key());
    this.service.setParam$(this.key(), this.params);

    this.service.param$(this.key())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        this.params = params;
        this.form.patchValue(params);
      });

    this.form.group.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(this.handleFormValueChange.bind(this));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private handleFormValueChange = () => {
    const { controls, value } = this.form.group;
    const { dateRange } = controls;

    this.params.updateFromPartial({
      ...value,
      dateFrom: dateRange.value[0],
      dateTo: dateRange.value[1],
    });
  }

  onSubmit() {
    this.service.setParam$(this.key(), this.params);
    this.form.patchValue(this.params);
  }

}
