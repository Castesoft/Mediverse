import { Component, inject, input, OnDestroy, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IconsService } from "src/app/_services/icons.service";
import { Pagination } from "src/app/_models/pagination";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Subject, takeUntil } from "rxjs";
import { DecimalPipe } from "@angular/common";
import { AlertModule } from "ngx-bootstrap/alert";
import { CatalogMode, Role, View } from "src/app/_models/types";
import { Router, RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { FilterForm, Event, EventParams } from "src/app/_models/event";
import { ControlsModule } from "src/app/_forms/controls.module";
import { TableModule } from "src/app/_shared/table/table.module";
import { CatalogModule } from "src/app/_shared/catalog.module";
import {EventsFilterMenuComponent} from "src/app/events/components/events-filter-menu.component";
import { EventsTableComponent } from "src/app/events/components/events-table.component";
import { EventsService } from "src/app/_services/events.service";
import { LayoutModule } from "src/app/_shared/layout.module";

@Component({
  host: { class: 'pb-6', },
  selector: 'div[eventsCatalog]',
  templateUrl: './events-catalog.component.html',
  standalone: true,
  imports: [ BsDropdownModule, RouterModule, ReactiveFormsModule, FontAwesomeModule, DecimalPipe,
    EventsTableComponent, AlertModule, ControlsModule, TableModule, CatalogModule,
    LayoutModule, EventsFilterMenuComponent, LayoutModule,
   ],
})
export class EventsCatalogComponent implements OnInit, OnDestroy {
  router = inject(Router);
  service = inject(EventsService);
  icons = inject(IconsService);

  key = input.required<string>();
  mode = input.required<CatalogMode>();
  view = input.required<View>();
  role = input.required<Role>();

  data?: Event[];
  params!: EventParams;
  pagination?: Pagination;
  form = new FilterForm();
  loading = true;
  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.params = new EventParams(this.key());

    this.service.setParam$(this.key(), this.params);

    this.service.param$(this.key())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        console.log(params);

        this.params = params;
        this.loadData(params);
        this.form.patchValue(params);
      });

    this.form.group.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(this.handleFormValueChange.bind(this));

    this.service.loading$(this.key())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((loading) => (this.loading = loading));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private loadData(params: EventParams) {
    this.service.loadPagedList(this.role(), this.key(), params).subscribe({
      next: (response) => {
        const { result, pagination } = response;
        this.data = result;
        this.pagination = pagination;
      },
    });
  }

  private handleFormValueChange = () => {
    const { controls, value } = this.form.group;
    const { dateRange } = controls;

    this.params.updateFromPartial({
      ...value,
      dateFrom: dateRange.value[0],
      dateTo: dateRange.value[1],
    });
  };

  onSubmit() {
    this.service.setParam$(this.key(), this.params);
    this.form.patchValue(this.params);
  }
}
