import { Component, inject, input, model } from "@angular/core";
import { FaIconComponent, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { IconsService } from "src/app/_services/icons.service";
import { ActivatedRoute, Router, RouterLink, RouterModule } from "@angular/router";
import { CatalogMode, View } from 'src/app/_models/types';
import { PrescriptionsService } from 'src/app/_services/prescriptions.service';
import { Prescription, PrescriptionParams } from 'src/app/_models/prescription';
import { Pagination } from 'src/app/_models/pagination';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LayoutModule } from 'src/app/_shared/layout.module';
import { AlertModule } from 'ngx-bootstrap/alert';
import { DecimalPipe } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ControlsModule } from 'src/app/_forms/controls.module';
import { CatalogModule } from 'src/app/_shared/catalog.module';
import { TableModule } from 'src/app/_shared/table/table.module';
import { PrescriptionsTableComponent } from './prescriptions-table/prescriptions-table.component';
import { createId } from "@paralleldrive/cuid2";

export class FilterForm {
  group: FormGroup;
  id: string;

  constructor() {
    this.id = `$recetafilterForm${createId()}`;
    this.group = new FormGroup({
      search: new FormControl(''),
      dateRange: new FormControl({ value: ['', ''], disabled: false }),
      pageSize: new FormControl(10, [
        Validators.required,
        Validators.min(1),
        Validators.max(50),
      ]),
      sex: new FormControl(''),
    });
  }

  patchValue(params: PrescriptionParams) {
    const dateRange = [params.dateFrom, params.dateTo];

    this.group.patchValue(
      {
        search: params.search,
        dateRange,
        pageSize: params.pageSize ?? 10,
        sex: params.sex
      },
      { emitEvent: false, onlySelf: true },
    );
  }
}


@Component({
  host: { class: 'pb-6', },
  selector: 'div[prescriptionsCatalog]',
  templateUrl: 'prescriptions-catalog.component.html',
  standalone: true,
  imports: [
    BsDropdownModule, RouterModule, ReactiveFormsModule, FontAwesomeModule, DecimalPipe,
    AlertModule, ControlsModule, TableModule, CatalogModule,
    LayoutModule, LayoutModule, PrescriptionsTableComponent
  ]
})
export class PrescriptionsCatalogComponent {
  service = inject(PrescriptionsService);
  icons = inject(IconsService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  key = model.required<string>();
  mode = model.required<CatalogMode>();
  view = model.required<View>();

  data?: Prescription[];
  params!: PrescriptionParams;
  pagination?: Pagination;
  form = new FilterForm();
  loading = true;
  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.params = new PrescriptionParams(this.key());

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
  }

  private loadData(params: PrescriptionParams, noCache = false) {
    this.service.loadPagedList(this.key(), params, noCache).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
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

  reloadData() {
    this.loadData(this.params, true);
  }

  deleteRange() {
    this.service.deleteRange$(this.key())?.subscribe(()=> this.reloadData());
  }

  onSubmit() {
    this.service.setParam$(this.key(), this.params);
    this.form.patchValue(this.params);
  }
}
