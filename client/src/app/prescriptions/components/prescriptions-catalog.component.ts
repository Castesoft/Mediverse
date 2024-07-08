import { Component, OnInit, OnDestroy, ViewChild, input, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { Prescription, PrescriptionParams, FilterForm } from '../../_models/prescription';
import { Pagination } from '../../_models/pagination';
import { PrescriptionsFilterModalComponent } from './prescriptions-filter-modal.component';
import { CatalogMode } from '../../_models/types';
import { datepickerConfig } from '../../_utils/util';
import { ConfirmService } from '../../_services/confirm/confirm.service';
import { PrescriptionsService } from '../../_services/data/prescriptions.service';
import { IconsService } from '../../_services/icons.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe, DecimalPipe, LowerCasePipe, TitleCasePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchTextComponent } from '../../_forms/search-text.component';
import { SearchDateRangeComponent } from '../../_forms/search-date-range.component';
import { TablePagerComponent } from '../../_utils/table/table-pager.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { PrescriptionsTableComponent } from './prescriptions-table.component';
import { prescriptions } from '../../data/prescriptions';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PrescriptionsFilterModalService } from './prescriptions-filter-modal.service';

@Component({
  selector: '[prescriptionsCatalogView]',
  templateUrl: './prescriptions-catalog.component.html',
  standalone: true,
  imports: [ FontAwesomeModule, LowerCasePipe, DecimalPipe, RouterModule, ReactiveFormsModule, SearchTextComponent,
    SearchDateRangeComponent, TablePagerComponent, AlertModule, PrescriptionsTableComponent, TitleCasePipe, DatePipe, 
   ],
})
export class PrescriptionsCatalogComponent implements OnInit, OnDestroy {
  private bsModalService = inject(BsModalService);
  private modalService = inject(PrescriptionsFilterModalService);

  prescriptions = prescriptions;
  
  isCompact = input.required<boolean>();
  mode = input.required<CatalogMode>();

  modalRef: BsModalRef<PrescriptionsFilterModalComponent> = new BsModalRef<PrescriptionsFilterModalComponent>();
  
  data?: Prescription[];
  params = new PrescriptionParams();
  pagination?: Pagination;
  filterForm = new FilterForm();
  datepickerConfig = datepickerConfig;
  loading: boolean = true;
  private ngUnsubscribe = new Subject<void>();

  createRoute = `/admin/utilerias/${this.service.subjectRoute}/nuevo`;

  get selectedCount(): number { return this.data?.filter((item) => item.isSelected).length ?? 0; }
  get hasSelected(): boolean { return this.data?.some((item) => item.isSelected) ?? false; }
  get selectedIdsAsString(): string { return (this.data?.filter((item) => item.isSelected).map((item) => item.id).join(',') || ''); }

  onDelete = () => Prescription.deleteItems(this.data ?? [], this.service, this.confirm, this.toastr);
  goToCreate = () => this.router.navigate([this.createRoute]);

  constructor(
    public router: Router,
    public service: PrescriptionsService,
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

  private loadData(params: PrescriptionParams) {
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
    this.modalRef = this.bsModalService.show(PrescriptionsFilterModalComponent, this.modalService.getConfig(this.filterForm.id));
  }

  hideFiltersModal = (): void => {
    this.modalRef.hide();
  }
}
