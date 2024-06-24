import { Component, OnInit, OnDestroy, ViewChild, input, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { Pagination } from '../../_models/pagination';
import { MedicinesFilterModalComponent } from './medicines-filter-modal.component';
import { CatalogMode } from '../../_models/types';
import { datepickerConfig } from '../../_utils/util';
import { ConfirmService } from '../../_services/confirm/confirm.service';
import { IconsService } from '../../_services/icons.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe, DecimalPipe, LowerCasePipe, NgClass, TitleCasePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchTextComponent } from '../../_forms/search-text.component';
import { SearchDateRangeComponent } from '../../_forms/search-date-range.component';
import { TablePagerComponent } from '../../_utils/table/table-pager.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { MedicinesTableComponent } from './medicines-table.component';
import { medicines } from '../../data/medicines';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MedicinesFilterModalService } from './medicines-filter-modal.service';
import { MedicinesService } from '../../_services/data/medicines.service';
import { Medicine, MedicineParams, FilterForm } from '../../_models/medicine';
import { TableHeaderComponent } from '../../_utils/table/table-header.component';

@Component({
  selector: '[medicinesCatalogView]',
  templateUrl: './medicines-catalog.component.html',
  standalone: true,
  imports: [ TableHeaderComponent, NgClass, FontAwesomeModule, LowerCasePipe, DecimalPipe, RouterModule, ReactiveFormsModule, SearchTextComponent,
    SearchDateRangeComponent, TablePagerComponent, AlertModule, MedicinesTableComponent, TitleCasePipe, DatePipe, 
   ],
})
export class MedicinesCatalogComponent implements OnInit, OnDestroy {
  private bsModalService = inject(BsModalService);
  private modalService = inject(MedicinesFilterModalService);

  isCompact = input.required<boolean>();
  mode = input.required<CatalogMode>();

  modalRef: BsModalRef<MedicinesFilterModalComponent> = new BsModalRef<MedicinesFilterModalComponent>();
  
  data?: Medicine[];
  params = new MedicineParams();
  pagination?: Pagination;
  filterForm = new FilterForm();
  datepickerConfig = datepickerConfig;
  loading: boolean = true;
  private ngUnsubscribe = new Subject<void>();

  createRoute = `/admin/utilerias/${this.service.subjectRoute}/nuevo`;

  get selectedCount(): number { return this.data?.filter((item) => item.isSelected).length ?? 0; }
  get hasSelected(): boolean { return this.data?.some((item) => item.isSelected) ?? false; }
  get selectedIdsAsString(): string { return (this.data?.filter((item) => item.isSelected).map((item) => item.id).join(',') || ''); }

  onDelete = () => Medicine.deleteItems(this.data ?? [], this.service, this.confirm, this.toastr);
  goToCreate = () => this.router.navigate([this.createRoute]);

  constructor(
    public router: Router,
    public service: MedicinesService,
    private confirm: ConfirmService,
    public icons: IconsService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.service.params$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        this.params = params;
        this.loadData(params);
        this.filterForm.patchValue(params);
      });

    this.filterForm.formGroup.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(this.handleFormValueChange.bind(this));

    this.service.loading$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((loading) => (this.loading = loading));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private loadData(params: MedicineParams) {
    this.service.getPagedList(params).subscribe({
      next: (response) => {
        const { result, pagination } = response;
        this.data = result;
        this.pagination = pagination;
      },
    });
  }

  private handleFormValueChange = () => {
    const { controls, value } = this.filterForm.formGroup;
    const { dateRange, search } = controls;

    this.params.updateFromPartial({
      ...value,
      dateCreatedStart: dateRange.value[0],
      dateCreatedEnd: dateRange.value[1],
    });

    this.service.setParams(this.params);
    this.filterForm.patchValue(this.params);
  };

  showFiltersModal = (): void => {
    this.modalRef = this.bsModalService.show(MedicinesFilterModalComponent, this.modalService.getConfig(this.filterForm.id));
  }

  hideFiltersModal = (): void => {
    this.modalRef.hide();
  }
}
