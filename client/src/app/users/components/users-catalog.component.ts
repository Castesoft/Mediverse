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
import { FilterForm, User, UserParams } from "src/app/_models/user";
import { ControlsModule } from "src/app/_forms/controls.module";
import { TableModule } from "src/app/_shared/table/table.module";
import { CatalogModule } from "src/app/_shared/catalog.module";
import {UsersFilterMenuComponent} from "src/app/users/components/users-filter-menu.component";
import { UsersTableComponent } from "src/app/users/components/users-table.component";
import { UsersService } from "src/app/_services/users.service";
import { LayoutModule } from "src/app/_shared/layout.module";

@Component({
  host: { class: 'pb-6', },
  selector: 'div[usersCatalog]',
  templateUrl: './users-catalog.component.html',
  standalone: true,
  imports: [ BsDropdownModule, RouterModule, ReactiveFormsModule, FontAwesomeModule, DecimalPipe,
    UsersTableComponent, AlertModule, ControlsModule, TableModule, CatalogModule,
    LayoutModule, UsersFilterMenuComponent, LayoutModule,
   ],
})
export class UsersCatalogComponent implements OnInit, OnDestroy {
  router = inject(Router);
  service = inject(UsersService);
  icons = inject(IconsService);

  key = input.required<string>();
  isCompact = input.required<boolean>();
  mode = input.required<CatalogMode>();
  view = input.required<View>();
  role = input.required<Role>();

  data?: User[];
  params!: UserParams;
  pagination?: Pagination;
  form = new FilterForm();
  loading = true;
  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.params = new UserParams(this.key());

    this.service.setParam$(this.key(), this.params);

    this.service.param$(this.key())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
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

  private loadData(params: UserParams) {
    this.service.loadPagedList(this.key(), params).subscribe({
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
